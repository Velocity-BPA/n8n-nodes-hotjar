/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const funnelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['funnel'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a conversion funnel',
				action: 'Create a funnel',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a funnel',
				action: 'Delete a funnel',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get funnel details',
				action: 'Get a funnel',
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				description: 'Get funnel conversion data',
				action: 'Get funnel analytics',
			},
			{
				name: 'Get Recordings',
				value: 'getRecordings',
				description: 'Get recordings for a funnel step',
				action: 'Get funnel recordings',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all funnels',
				action: 'List funnels',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update funnel steps',
				action: 'Update a funnel',
			},
		],
		default: 'list',
	},
];

export const funnelFields: INodeProperties[] = [
	// ----------------------------------
	//         Common Fields
	// ----------------------------------
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['funnel'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         Funnel ID (for get, update, delete, etc.)
	// ----------------------------------
	{
		displayName: 'Funnel ID',
		name: 'funnelId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['get', 'update', 'delete', 'getAnalytics', 'getRecordings'],
			},
		},
		default: '',
		description: 'The funnel identifier',
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
				resource: ['funnel'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the funnel',
	},
	{
		displayName: 'Steps',
		name: 'steps',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['create'],
			},
		},
		default: '[]',
		description: 'Array of funnel step definitions',
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
				resource: ['funnel'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the funnel',
			},
			{
				displayName: 'Steps',
				name: 'steps',
				type: 'json',
				default: '[]',
				description: 'Array of funnel step definitions',
			},
		],
	},

	// ----------------------------------
	//         getRecordings
	// ----------------------------------
	{
		displayName: 'Step Index',
		name: 'stepIndex',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['getRecordings'],
			},
		},
		default: 0,
		description: 'The funnel step index (0-based)',
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
				resource: ['funnel'],
				operation: ['list', 'getRecordings'],
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
				resource: ['funnel'],
				operation: ['list', 'getRecordings'],
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

	// ----------------------------------
	//         getAnalytics Date Range
	// ----------------------------------
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'collection',
		placeholder: 'Add Date Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['getAnalytics'],
			},
		},
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Start date for analysis',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'End date for analysis',
			},
		],
	},
];
