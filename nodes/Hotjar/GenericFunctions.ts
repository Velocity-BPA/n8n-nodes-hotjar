/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IHotjarCredentials, IHotjarTokenResponse } from './types/HotjarTypes';

const BASE_URL = 'https://api.hotjar.io';
const TOKEN_ENDPOINT = `${BASE_URL}/v1/oauth/token`;

/**
 * Token cache to avoid repeated token requests
 */
const tokenCache: Map<string, { token: string; expiresAt: number }> = new Map();

/**
 * Display licensing notice on first load
 */
let licenseNoticeDisplayed = false;

function displayLicenseNotice(): void {
	if (!licenseNoticeDisplayed) {
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
		licenseNoticeDisplayed = true;
	}
}

/**
 * Get OAuth2 access token using client credentials flow
 */
export async function getAccessToken(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	credentials: IHotjarCredentials,
): Promise<string> {
	const cacheKey = `${credentials.clientId}`;
	const cached = tokenCache.get(cacheKey);

	// Check if we have a valid cached token (with 60 second buffer)
	if (cached && cached.expiresAt > Date.now() + 60000) {
		return cached.token;
	}

	const options: IRequestOptions = {
		method: 'POST',
		uri: TOKEN_ENDPOINT,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		form: {
			grant_type: 'client_credentials',
			client_id: credentials.clientId,
			client_secret: credentials.clientSecret,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.request(options)) as IHotjarTokenResponse;

		// Cache the token
		tokenCache.set(cacheKey, {
			token: response.access_token,
			expiresAt: Date.now() + response.expires_in * 1000,
		});

		return response.access_token;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to obtain access token from Hotjar',
		});
	}
}

/**
 * Make an API request to Hotjar
 */
export async function hotjarApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject> {
	displayLicenseNotice();

	const credentials = (await this.getCredentials('hotjarApi')) as unknown as IHotjarCredentials;
	const accessToken = await getAccessToken.call(this, credentials);

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}/v1${endpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		const jsonError = error as JsonObject;

		// Handle specific error codes
		if (jsonError.statusCode === 429) {
			throw new NodeApiError(this.getNode(), jsonError, {
				message: 'Rate limit exceeded. Hotjar allows 3000 requests per minute (50/second).',
				description: 'Please wait a moment before retrying.',
			});
		}

		if (jsonError.statusCode === 401) {
			// Clear token cache on auth error
			tokenCache.clear();
			throw new NodeApiError(this.getNode(), jsonError, {
				message: 'Authentication failed',
				description: 'Please verify your Hotjar API credentials.',
			});
		}

		throw new NodeApiError(this.getNode(), jsonError);
	}
}

/**
 * Make an API request to Hotjar and return all items using cursor pagination
 */
export async function hotjarApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	query?: IDataObject,
	limit?: number,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let cursor: string | null = null;
	const pageSize = 100;

	do {
		const requestQuery: IDataObject = {
			...query,
			limit: pageSize,
		};

		if (cursor) {
			requestQuery.cursor = cursor;
		}

		const response = (await hotjarApiRequest.call(
			this,
			method,
			endpoint,
			undefined,
			requestQuery,
		)) as IDataObject;

		const items = (response.results as IDataObject[]) || [];
		results.push(...items);

		cursor = (response.next_cursor as string) || null;

		// Stop if we've reached the requested limit
		if (limit && results.length >= limit) {
			return results.slice(0, limit);
		}
	} while (cursor !== null);

	return results;
}

/**
 * Validate and format date for API requests
 */
export function formatDate(date: string | Date): string {
	if (date instanceof Date) {
		return date.toISOString();
	}
	// Validate ISO format
	const parsed = new Date(date);
	if (isNaN(parsed.getTime())) {
		throw new Error(`Invalid date format: ${date}`);
	}
	return parsed.toISOString();
}

/**
 * Build query parameters from operation parameters
 */
export function buildQueryParams(params: IDataObject): IDataObject {
	const query: IDataObject = {};

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			if (key === 'dateFrom' || key === 'dateTo') {
				query[key === 'dateFrom' ? 'date_from' : 'date_to'] = formatDate(value as string);
			} else {
				// Convert camelCase to snake_case
				const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
				query[snakeKey] = value;
			}
		}
	}

	return query;
}
