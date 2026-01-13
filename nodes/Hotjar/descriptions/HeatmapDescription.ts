/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const heatmapOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['heatmap'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new heatmap',
				action: 'Create a heatmap',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a heatmap',
				action: 'Delete a heatmap',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get heatmap details',
				action: 'Get a heatmap',
			},
			{
				name: 'Get Data',
				value: 'getData',
				description: 'Get click/scroll/move data',
				action: 'Get heatmap data',
			},
			{
				name: 'Get Screenshot',
				value: 'getScreenshot',
				description: 'Get page screenshot',
				action: 'Get heatmap screenshot',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List heatmaps',
				action: 'List heatmaps',
			},
			{
				name: 'Refresh',
				value: 'refresh',
				description: 'Regenerate heatmap data',
				action: 'Refresh heatmap',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update heatmap settings',
				action: 'Update a heatmap',
			},
		],
		default: 'list',
	},
];

export const heatmapFields: INodeProperties[] = [
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
				resource: ['heatmap'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         Heatmap ID (for get, update, delete, etc.)
	// ----------------------------------
	{
		displayName: 'Heatmap ID',
		name: 'heatmapId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['heatmap'],
				operation: ['get', 'update', 'delete', 'getData', 'getScreenshot', 'refresh'],
			},
		},
		default: '',
		description: 'The heatmap identifier',
	},

	// ----------------------------------
	//         create
	// ----------------------------------
	{
		displayName: 'Page URL',
		name: 'pageUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['heatmap'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'https://example.com/page',
		description: 'Target page URL for the heatmap',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['heatmap'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Click', value: 'click' },
			{ name: 'Move', value: 'move' },
			{ name: 'Scroll', value: 'scroll' },
		],
		default: 'click',
		description: 'Type of heatmap to create',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['heatmap'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Device',
				name: 'device',
				type: 'options',
				options: [
					{ name: 'All Devices', value: 'all' },
					{ name: 'Desktop', value: 'desktop' },
					{ name: 'Mobile', value: 'mobile' },
					{ name: 'Tablet', value: 'tablet' },
				],
				default: 'all',
				description: 'Device type for the heatmap',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Custom name for the heatmap',
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
				resource: ['heatmap'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Device',
				name: 'device',
				type: 'options',
				options: [
					{ name: 'All Devices', value: 'all' },
					{ name: 'Desktop', value: 'desktop' },
					{ name: 'Mobile', value: 'mobile' },
					{ name: 'Tablet', value: 'tablet' },
				],
				default: 'all',
				description: 'Device type for the heatmap',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Custom name for the heatmap',
			},
			{
				displayName: 'Page URL',
				name: 'pageUrl',
				type: 'string',
				default: '',
				description: 'Target page URL for the heatmap',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Click', value: 'click' },
					{ name: 'Move', value: 'move' },
					{ name: 'Scroll', value: 'scroll' },
				],
				default: 'click',
				description: 'Type of heatmap',
			},
		],
	},

	// ----------------------------------
	//         getData Options
	// ----------------------------------
	{
		displayName: 'Data Options',
		name: 'dataOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['heatmap'],
				operation: ['getData'],
			},
		},
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Start date for heatmap data',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'End date for heatmap data',
			},
			{
				displayName: 'Device',
				name: 'device',
				type: 'options',
				options: [
					{ name: 'All Devices', value: 'all' },
					{ name: 'Desktop', value: 'desktop' },
					{ name: 'Mobile', value: 'mobile' },
					{ name: 'Tablet', value: 'tablet' },
				],
				default: 'all',
				description: 'Device type filter',
			},
		],
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
				resource: ['heatmap'],
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
				resource: ['heatmap'],
				operation: ['list'],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['heatmap'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Paused', value: 'paused' },
				],
				default: '',
				description: 'Filter heatmaps by status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Click', value: 'click' },
					{ name: 'Move', value: 'move' },
					{ name: 'Scroll', value: 'scroll' },
				],
				default: '',
				description: 'Filter heatmaps by type',
			},
			{
				displayName: 'URL Contains',
				name: 'urlContains',
				type: 'string',
				default: '',
				description: 'Filter heatmaps where URL contains this string',
			},
		],
	},
];
