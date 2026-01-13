/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const surveyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['survey'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new survey',
				action: 'Create a survey',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a survey',
				action: 'Delete a survey',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				description: 'Clone an existing survey',
				action: 'Duplicate a survey',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get survey details and configuration',
				action: 'Get a survey',
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				description: 'Get survey performance metrics',
				action: 'Get survey analytics',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all surveys for a site',
				action: 'List surveys',
			},
			{
				name: 'List Questions',
				value: 'listQuestions',
				description: 'Get all questions in a survey',
				action: 'List survey questions',
			},
			{
				name: 'Publish',
				value: 'publish',
				description: 'Publish survey to site',
				action: 'Publish a survey',
			},
			{
				name: 'Unpublish',
				value: 'unpublish',
				description: 'Remove survey from site',
				action: 'Unpublish a survey',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update survey settings',
				action: 'Update a survey',
			},
		],
		default: 'list',
	},
];

export const surveyFields: INodeProperties[] = [
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
				resource: ['survey'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         Survey ID (for get, update, delete, etc.)
	// ----------------------------------
	{
		displayName: 'Survey ID',
		name: 'surveyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['survey'],
				operation: ['get', 'update', 'delete', 'publish', 'unpublish', 'duplicate', 'getAnalytics', 'listQuestions'],
			},
		},
		default: '',
		description: 'The survey identifier',
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
				resource: ['survey'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the survey',
	},
	{
		displayName: 'Questions',
		name: 'questions',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['survey'],
				operation: ['create'],
			},
		},
		default: '[]',
		description: 'Array of question objects for the survey',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['survey'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Appearance',
				name: 'appearance',
				type: 'json',
				default: '{}',
				description: 'Survey styling options as JSON',
			},
			{
				displayName: 'Targeting',
				name: 'targeting',
				type: 'json',
				default: '{}',
				description: 'Survey targeting rules as JSON',
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
				resource: ['survey'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Appearance',
				name: 'appearance',
				type: 'json',
				default: '{}',
				description: 'Survey styling options as JSON',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the survey',
			},
			{
				displayName: 'Questions',
				name: 'questions',
				type: 'json',
				default: '[]',
				description: 'Array of question objects for the survey',
			},
			{
				displayName: 'Targeting',
				name: 'targeting',
				type: 'json',
				default: '{}',
				description: 'Survey targeting rules as JSON',
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
				resource: ['survey'],
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
				resource: ['survey'],
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
				resource: ['survey'],
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
					{ name: 'Draft', value: 'draft' },
					{ name: 'Paused', value: 'paused' },
				],
				default: 'active',
				description: 'Filter surveys by status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Feedback', value: 'feedback' },
					{ name: 'Poll', value: 'poll' },
					{ name: 'Survey', value: 'survey' },
				],
				default: 'survey',
				description: 'Filter surveys by type',
			},
		],
	},

	// ----------------------------------
	//         getAnalytics Options
	// ----------------------------------
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'collection',
		placeholder: 'Add Date Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['survey'],
				operation: ['getAnalytics'],
			},
		},
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Start date for analytics',
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'End date for analytics',
			},
		],
	},
];
