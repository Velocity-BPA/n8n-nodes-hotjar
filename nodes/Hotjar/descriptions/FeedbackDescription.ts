/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const feedbackOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['feedback'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a feedback item',
				action: 'Delete feedback',
			},
			{
				name: 'Export',
				value: 'export',
				description: 'Export feedback data',
				action: 'Export feedback',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get feedback details',
				action: 'Get feedback',
			},
			{
				name: 'Get Trends',
				value: 'getTrends',
				description: 'Get feedback trends over time',
				action: 'Get feedback trends',
			},
			{
				name: 'Get Widget Config',
				value: 'getWidgetConfig',
				description: 'Get feedback widget configuration',
				action: 'Get widget config',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List incoming feedback',
				action: 'List feedback',
			},
			{
				name: 'Update Widget',
				value: 'updateWidget',
				description: 'Update feedback widget settings',
				action: 'Update widget',
			},
		],
		default: 'list',
	},
];

export const feedbackFields: INodeProperties[] = [
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
				resource: ['feedback'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         get / delete
	// ----------------------------------
	{
		displayName: 'Feedback ID',
		name: 'feedbackId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The feedback identifier',
	},

	// ----------------------------------
	//         list / export Options
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['list', 'export'],
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
				resource: ['feedback'],
				operation: ['list', 'export'],
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
	//         Filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['list', 'export', 'getTrends'],
			},
		},
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Filter feedback from this date',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Filter feedback until this date',
			},
			{
				displayName: 'Emotion',
				name: 'emotion',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Angry', value: 'angry' },
					{ name: 'Confused', value: 'confused' },
					{ name: 'Happy', value: 'happy' },
					{ name: 'Neutral', value: 'neutral' },
					{ name: 'Sad', value: 'sad' },
				],
				default: '',
				description: 'Filter by user emotion',
			},
			{
				displayName: 'Page URL',
				name: 'pageUrl',
				type: 'string',
				default: '',
				description: 'Filter by page URL',
			},
		],
	},

	// ----------------------------------
	//         updateWidget
	// ----------------------------------
	{
		displayName: 'Widget Settings',
		name: 'widgetSettings',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['updateWidget'],
			},
		},
		default: '{}',
		description: 'Widget configuration settings as JSON',
	},
];
