/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const siteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['site'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a new site',
				action: 'Create a site',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a site',
				action: 'Delete a site',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get site details',
				action: 'Get a site',
			},
			{
				name: 'Get Settings',
				value: 'getSettings',
				description: 'Get tracking configuration',
				action: 'Get site settings',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all sites in organization',
				action: 'List sites',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update site settings',
				action: 'Update a site',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				description: 'Update tracking settings',
				action: 'Update site settings',
			},
			{
				name: 'Verify',
				value: 'verify',
				description: 'Check site installation status',
				action: 'Verify site',
			},
		],
		default: 'list',
	},
];

export const siteFields: INodeProperties[] = [
	// ----------------------------------
	//         Site ID (for get, update, delete, etc.)
	// ----------------------------------
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['get', 'update', 'delete', 'getSettings', 'updateSettings', 'verify'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The site display name',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'https://example.com',
		description: 'The site URL',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Sampling Rate',
				name: 'samplingRate',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 100,
				description: 'Data sampling rate (1-100%)',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: 'UTC',
				description: 'Site timezone (e.g., America/New_York)',
			},
		],
	},

	// ----------------------------------
	//         update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The site display name',
			},
			{
				displayName: 'Sampling Rate',
				name: 'samplingRate',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 100,
				description: 'Data sampling rate (1-100%)',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
				description: 'Site timezone (e.g., America/New_York)',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The site URL',
			},
		],
	},

	// ----------------------------------
	//         updateSettings
	// ----------------------------------
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['updateSettings'],
			},
		},
		default: '{}',
		description: 'Tracking configuration settings as JSON',
	},

	// ----------------------------------
	//         list Options
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['list'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['list'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
