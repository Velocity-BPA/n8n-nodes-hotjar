/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				description: 'Batch delete user data',
				action: 'Bulk delete users',
			},
			{
				name: 'Cancel Deletion',
				value: 'cancelDeletion',
				description: 'Cancel a pending deletion request',
				action: 'Cancel deletion',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Request user data deletion (GDPR)',
				action: 'Delete a user',
			},
			{
				name: 'Get Deletion Status',
				value: 'getDeletionStatus',
				description: 'Check deletion request status',
				action: 'Get deletion status',
			},
			{
				name: 'List Deletion Requests',
				value: 'listDeletionRequests',
				description: 'Get all deletion requests',
				action: 'List deletion requests',
			},
			{
				name: 'Lookup',
				value: 'lookup',
				description: 'Find user by identifier',
				action: 'Lookup a user',
			},
			{
				name: 'Lookup by Email',
				value: 'lookupByEmail',
				description: 'Find user by email address',
				action: 'Lookup user by email',
			},
			{
				name: 'Lookup by User ID',
				value: 'lookupByUserId',
				description: 'Find user by custom user ID',
				action: 'Lookup user by user ID',
			},
		],
		default: 'lookup',
	},
];

export const userFields: INodeProperties[] = [
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
				resource: ['user'],
			},
		},
		default: '',
		description: 'The Hotjar site ID',
	},

	// ----------------------------------
	//         lookup
	// ----------------------------------
	{
		displayName: 'Lookup By',
		name: 'lookupBy',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['lookup'],
			},
		},
		options: [
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'Hotjar User ID',
				value: 'hotjarUserId',
			},
			{
				name: 'User ID',
				value: 'userId',
			},
		],
		default: 'email',
		description: 'The method to use for user lookup',
	},
	{
		displayName: 'Value',
		name: 'lookupValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['lookup'],
			},
		},
		default: '',
		description: 'The value to search for (email, user ID, or Hotjar user ID)',
	},

	// ----------------------------------
	//         lookupByEmail
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['lookupByEmail'],
			},
		},
		default: '',
		description: 'The email address to search for',
	},

	// ----------------------------------
	//         lookupByUserId
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['lookupByUserId'],
			},
		},
		default: '',
		description: 'The custom user ID to search for',
	},

	// ----------------------------------
	//         delete
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'The user identifier to delete',
	},
	{
		displayName: 'Confirmation',
		name: 'confirm',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['delete'],
			},
		},
		default: false,
		description: 'Confirm that you want to permanently delete this user\'s data. This action cannot be undone.',
	},

	// ----------------------------------
	//         bulkDelete
	// ----------------------------------
	{
		displayName: 'User IDs',
		name: 'userIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['bulkDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of user IDs to delete',
	},
	{
		displayName: 'Confirmation',
		name: 'confirm',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['bulkDelete'],
			},
		},
		default: false,
		description: 'Confirm that you want to permanently delete these users\' data. This action cannot be undone.',
	},

	// ----------------------------------
	//         getDeletionStatus / cancelDeletion
	// ----------------------------------
	{
		displayName: 'Deletion Request ID',
		name: 'deletionRequestId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getDeletionStatus', 'cancelDeletion'],
			},
		},
		default: '',
		description: 'The deletion request identifier',
	},

	// ----------------------------------
	//         listDeletionRequests Options
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['listDeletionRequests'],
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
				resource: ['user'],
				operation: ['listDeletionRequests'],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['listDeletionRequests'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Processing', value: 'processing' },
				],
				default: '',
				description: 'Filter by deletion request status',
			},
		],
	},
];
