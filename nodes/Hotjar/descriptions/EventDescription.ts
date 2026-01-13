/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get event details',
				action: 'Get an event',
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				description: 'Get event occurrence data',
				action: 'Get event analytics',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List tracked events',
				action: 'List events',
			},
			{
				name: 'Search Recordings',
				value: 'searchRecordings',
				description: 'Find recordings containing an event',
				action: 'Search event recordings',
			},
		],
		default: 'list',
	},
];

export const eventFields: INodeProperties[] = [
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
				resource: ['event'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         Event Name (for get, getAnalytics, searchRecordings)
	// ----------------------------------
	{
		displayName: 'Event Name',
		name: 'eventName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['get', 'getAnalytics', 'searchRecordings'],
			},
		},
		default: '',
		description: 'The event identifier/name',
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
				resource: ['event'],
				operation: ['list', 'searchRecordings'],
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
				resource: ['event'],
				operation: ['list', 'searchRecordings'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 50,
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         Date Range
	// ----------------------------------
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'collection',
		placeholder: 'Add Date Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAnalytics', 'searchRecordings'],
			},
		},
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Start date for event data',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'End date for event data',
			},
		],
	},

	// ----------------------------------
	//         getAnalytics Options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getAnalytics'],
			},
		},
		options: [
			{
				displayName: 'Attributes',
				name: 'attributes',
				type: 'json',
				default: '{}',
				description: 'Event attributes to filter by',
			},
		],
	},
];
