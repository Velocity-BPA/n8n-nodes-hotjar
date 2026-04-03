/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HotjarApi implements ICredentialType {
	name = 'hotjarApi';
	displayName = 'Hotjar API';
	documentationUrl = 'https://developer.hotjar.com/docs/getting-started';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key for Hotjar. Generate one in your Hotjar dashboard under Organization settings > API access.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://insights.hotjar.com/api/v2',
			description: 'Base URL for Hotjar API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://insights.hotjar.com/api/v2',
			url: '/sites',
			method: 'GET',
		},
	};
}