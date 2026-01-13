/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const recordingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['recording'],
			},
		},
		options: [
			{
				name: 'Add Tag',
				value: 'addTag',
				description: 'Tag a recording',
				action: 'Add tag to recording',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a recording',
				action: 'Delete a recording',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get recording details',
				action: 'Get a recording',
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				description: 'Get events in a recording',
				action: 'Get recording events',
			},
			{
				name: 'Get Playback URL',
				value: 'getPlaybackUrl',
				description: 'Get recording playback URL',
				action: 'Get playback URL',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List session recordings',
				action: 'List recordings',
			},
			{
				name: 'Remove Tag',
				value: 'removeTag',
				description: 'Remove tag from recording',
				action: 'Remove tag from recording',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search recordings by criteria',
				action: 'Search recordings',
			},
			{
				name: 'Share',
				value: 'share',
				description: 'Generate shareable link',
				action: 'Share recording',
			},
		],
		default: 'list',
	},
];

export const recordingFields: INodeProperties[] = [
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
				resource: ['recording'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         Recording ID (for get, delete, etc.)
	// ----------------------------------
	{
		displayName: 'Recording ID',
		name: 'recordingId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['recording'],
				operation: ['get', 'delete', 'getPlaybackUrl', 'getEvents', 'addTag', 'removeTag', 'share'],
			},
		},
		default: '',
		description: 'The recording identifier',
	},

	// ----------------------------------
	//         addTag / removeTag
	// ----------------------------------
	{
		displayName: 'Tag',
		name: 'tag',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['recording'],
				operation: ['addTag', 'removeTag'],
			},
		},
		default: '',
		description: 'The tag to add or remove',
	},

	// ----------------------------------
	//         list / search Options
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['recording'],
				operation: ['list', 'search'],
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
				resource: ['recording'],
				operation: ['list', 'search'],
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
				resource: ['recording'],
				operation: ['list', 'search'],
			},
		},
		options: [
			{
				displayName: 'Browser',
				name: 'browser',
				type: 'options',
				options: [
					{ name: 'Chrome', value: 'chrome' },
					{ name: 'Edge', value: 'edge' },
					{ name: 'Firefox', value: 'firefox' },
					{ name: 'Safari', value: 'safari' },
				],
				default: '',
				description: 'Filter by browser type',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Filter by country code (ISO 3166-1 alpha-2)',
			},
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Filter recordings from this date',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Filter recordings until this date',
			},
			{
				displayName: 'Device',
				name: 'device',
				type: 'options',
				options: [
					{ name: 'Desktop', value: 'desktop' },
					{ name: 'Mobile', value: 'mobile' },
					{ name: 'Tablet', value: 'tablet' },
				],
				default: '',
				description: 'Filter by device type',
			},
			{
				displayName: 'Has Tag',
				name: 'hasTag',
				type: 'string',
				default: '',
				description: 'Filter recordings that have this tag',
			},
			{
				displayName: 'Maximum Duration (Seconds)',
				name: 'maxDuration',
				type: 'number',
				default: 0,
				description: 'Filter recordings with maximum duration in seconds',
			},
			{
				displayName: 'Minimum Duration (Seconds)',
				name: 'minDuration',
				type: 'number',
				default: 0,
				description: 'Filter recordings with minimum duration in seconds',
			},
			{
				displayName: 'URL Contains',
				name: 'urlContains',
				type: 'string',
				default: '',
				description: 'Filter recordings where URL contains this string',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter recordings by user identifier',
			},
		],
	},

	// ----------------------------------
	//         share Options
	// ----------------------------------
	{
		displayName: 'Share Options',
		name: 'shareOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['recording'],
				operation: ['share'],
			},
		},
		options: [
			{
				displayName: 'Expires In (Days)',
				name: 'expiresInDays',
				type: 'number',
				default: 7,
				description: 'Number of days until the link expires',
			},
			{
				displayName: 'Password Protected',
				name: 'passwordProtected',
				type: 'boolean',
				default: false,
				description: 'Whether the shared link should be password protected',
			},
		],
	},
];
