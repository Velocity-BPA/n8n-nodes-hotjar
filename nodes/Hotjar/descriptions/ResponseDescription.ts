/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const responseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['response'],
			},
		},
		options: [
			{
				name: 'Bulk Export',
				value: 'bulkExport',
				description: 'Export responses for multiple surveys',
				action: 'Bulk export responses',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a specific response',
				action: 'Delete a response',
			},
			{
				name: 'Export',
				value: 'export',
				description: 'Export all responses for a survey',
				action: 'Export responses',
			},
			{
				name: 'Filter',
				value: 'filter',
				description: 'Get responses matching criteria',
				action: 'Filter responses',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get specific response details',
				action: 'Get a response',
			},
			{
				name: 'Get Trends',
				value: 'getTrends',
				description: 'Get response trends over time',
				action: 'Get response trends',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List survey responses with pagination',
				action: 'List responses',
			},
		],
		default: 'list',
	},
];

export const responseFields: INodeProperties[] = [
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
				resource: ['response'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},
	{
		displayName: 'Survey ID',
		name: 'surveyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['response'],
				operation: ['list', 'get', 'export', 'delete', 'getTrends', 'filter'],
			},
		},
		default: '',
		description: 'The survey identifier',
	},

	// ----------------------------------
	//         get / delete
	// ----------------------------------
	{
		displayName: 'Response ID',
		name: 'responseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['response'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The response identifier',
	},

	// ----------------------------------
	//         bulkExport
	// ----------------------------------
	{
		displayName: 'Survey IDs',
		name: 'surveyIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['response'],
				operation: ['bulkExport'],
			},
		},
		default: '',
		description: 'Comma-separated list of survey IDs to export',
	},

	// ----------------------------------
	//         list / export / filter Options
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['response'],
				operation: ['list', 'export', 'filter', 'bulkExport'],
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
				resource: ['response'],
				operation: ['list', 'export', 'filter', 'bulkExport'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
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
				resource: ['response'],
				operation: ['list', 'export', 'filter', 'getTrends', 'bulkExport'],
			},
		},
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Filter responses from this date',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Filter responses until this date',
			},
		],
	},

	// ----------------------------------
	//         export Options
	// ----------------------------------
	{
		displayName: 'Export Options',
		name: 'exportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['response'],
				operation: ['export', 'bulkExport'],
			},
		},
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'CSV', value: 'csv' },
					{ name: 'JSON', value: 'json' },
				],
				default: 'json',
				description: 'Export format',
			},
		],
	},
];
