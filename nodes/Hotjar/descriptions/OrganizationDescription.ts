/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		options: [
			{
				name: 'Create API Key',
				value: 'createApiKey',
				description: 'Generate a new API key',
				action: 'Create an API key',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get organization details',
				action: 'Get organization',
			},
			{
				name: 'Invite Member',
				value: 'inviteMember',
				description: 'Invite a new team member',
				action: 'Invite a member',
			},
			{
				name: 'List API Keys',
				value: 'listApiKeys',
				description: 'List all API keys',
				action: 'List API keys',
			},
			{
				name: 'List Members',
				value: 'listMembers',
				description: 'List organization team members',
				action: 'List members',
			},
			{
				name: 'Remove Member',
				value: 'removeMember',
				description: 'Remove a team member',
				action: 'Remove a member',
			},
			{
				name: 'Revoke API Key',
				value: 'revokeApiKey',
				description: 'Revoke an API key',
				action: 'Revoke API key',
			},
			{
				name: 'Update Member Role',
				value: 'updateMemberRole',
				description: 'Change member permissions',
				action: 'Update member role',
			},
		],
		default: 'get',
	},
];

export const organizationFields: INodeProperties[] = [
	// ----------------------------------
	//         Organization ID
	// ----------------------------------
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		default: '',
		description: 'The organization identifier',
	},

	// ----------------------------------
	//         Member operations
	// ----------------------------------
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['removeMember', 'updateMemberRole'],
			},
		},
		default: '',
		description: 'The member identifier',
	},

	// ----------------------------------
	//         inviteMember
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['inviteMember'],
			},
		},
		default: '',
		description: 'Email address of the member to invite',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['inviteMember', 'updateMemberRole'],
			},
		},
		options: [
			{ name: 'Admin', value: 'admin' },
			{ name: 'Member', value: 'member' },
			{ name: 'Viewer', value: 'viewer' },
		],
		default: 'member',
		description: 'The role to assign to the member',
	},

	// ----------------------------------
	//         API Key operations
	// ----------------------------------
	{
		displayName: 'API Key ID',
		name: 'apiKeyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['revokeApiKey'],
			},
		},
		default: '',
		description: 'The API key identifier to revoke',
	},
	{
		displayName: 'API Key Name',
		name: 'apiKeyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['createApiKey'],
			},
		},
		default: '',
		description: 'Name for the new API key',
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
				resource: ['organization'],
				operation: ['listMembers', 'listApiKeys'],
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
				resource: ['organization'],
				operation: ['listMembers', 'listApiKeys'],
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
