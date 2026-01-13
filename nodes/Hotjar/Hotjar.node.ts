/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	buildQueryParams,
	hotjarApiRequest,
	hotjarApiRequestAllItems,
} from './GenericFunctions';

import { surveyOperations, surveyFields } from './descriptions/SurveyDescription';
import { responseOperations, responseFields } from './descriptions/ResponseDescription';
import { siteOperations, siteFields } from './descriptions/SiteDescription';
import { userOperations, userFields } from './descriptions/UserDescription';
import { recordingOperations, recordingFields } from './descriptions/RecordingDescription';
import { heatmapOperations, heatmapFields } from './descriptions/HeatmapDescription';
import { feedbackOperations, feedbackFields } from './descriptions/FeedbackDescription';
import { funnelOperations, funnelFields } from './descriptions/FunnelDescription';
import { eventOperations, eventFields } from './descriptions/EventDescription';
import { organizationOperations, organizationFields } from './descriptions/OrganizationDescription';

export class Hotjar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hotjar',
		name: 'hotjar',
		icon: 'file:hotjar.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Hotjar API for behavior analytics and user feedback',
		defaults: {
			name: 'Hotjar',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'hotjarApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Feedback',
						value: 'feedback',
					},
					{
						name: 'Funnel',
						value: 'funnel',
					},
					{
						name: 'Heatmap',
						value: 'heatmap',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Recording',
						value: 'recording',
					},
					{
						name: 'Site',
						value: 'site',
					},
					{
						name: 'Survey',
						value: 'survey',
					},
					{
						name: 'Survey Response',
						value: 'response',
					},
					{
						name: 'User (GDPR)',
						value: 'user',
					},
				],
				default: 'survey',
			},
			// Survey
			...surveyOperations,
			...surveyFields,
			// Response
			...responseOperations,
			...responseFields,
			// Site
			...siteOperations,
			...siteFields,
			// User
			...userOperations,
			...userFields,
			// Recording
			...recordingOperations,
			...recordingFields,
			// Heatmap
			...heatmapOperations,
			...heatmapFields,
			// Feedback
			...feedbackOperations,
			...feedbackFields,
			// Funnel
			...funnelOperations,
			...funnelFields,
			// Event
			...eventOperations,
			...eventFields,
			// Organization
			...organizationOperations,
			...organizationFields,
		],
	};

	methods = {
		loadOptions: {
			async getSites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await hotjarApiRequest.call(this, 'GET', '/sites');
				const sites = (response.results as IDataObject[]) || [];
				return sites.map((site) => ({
					name: `${site.name} (${site.url})`,
					value: site.id as string,
				}));
			},

			async getSurveys(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const siteId = this.getCurrentNodeParameter('siteId') as string;
				if (!siteId) {
					return [];
				}
				const response = await hotjarApiRequest.call(this, 'GET', `/sites/${siteId}/surveys`);
				const surveys = (response.results as IDataObject[]) || [];
				return surveys.map((survey) => ({
					name: survey.name as string,
					value: survey.id as string,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// Survey Operations
				if (resource === 'survey') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys`,
								query,
								limit,
							);
						}
					}

					if (operation === 'get') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/surveys/${surveyId}`,
						);
					}

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const questions = JSON.parse(this.getNodeParameter('questions', i) as string);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { name, questions };

						if (additionalFields.targeting) {
							body.targeting = JSON.parse(additionalFields.targeting as string);
						}
						if (additionalFields.appearance) {
							body.appearance = JSON.parse(additionalFields.appearance as string);
						}

						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/surveys`,
							body,
						);
					}

					if (operation === 'update') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.questions) body.questions = JSON.parse(updateFields.questions as string);
						if (updateFields.targeting) body.targeting = JSON.parse(updateFields.targeting as string);
						if (updateFields.appearance) body.appearance = JSON.parse(updateFields.appearance as string);

						responseData = await hotjarApiRequest.call(
							this,
							'PATCH',
							`/sites/${siteId}/surveys/${surveyId}`,
							body,
						);
					}

					if (operation === 'delete') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/sites/${siteId}/surveys/${surveyId}`,
						);
					}

					if (operation === 'publish') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/surveys/${surveyId}/publish`,
						);
					}

					if (operation === 'unpublish') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/surveys/${surveyId}/unpublish`,
						);
					}

					if (operation === 'duplicate') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/surveys/${surveyId}/duplicate`,
						);
					}

					if (operation === 'getAnalytics') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;
						const query = buildQueryParams(dateRange);

						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/surveys/${surveyId}/analytics`,
							undefined,
							query,
						);
					}

					if (operation === 'listQuestions') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/surveys/${surveyId}/questions`,
						);
					}
				}

				// Survey Response Operations
				if (resource === 'response') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'list') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys/${surveyId}/responses`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys/${surveyId}/responses`,
								query,
								limit,
							);
						}
					}

					if (operation === 'get') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const responseId = this.getNodeParameter('responseId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/surveys/${surveyId}/responses/${responseId}`,
						);
					}

					if (operation === 'export') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const exportOptions = this.getNodeParameter('exportOptions', i, {}) as IDataObject;
						const query = buildQueryParams({ ...filters, ...exportOptions });

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys/${surveyId}/responses`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys/${surveyId}/responses`,
								query,
								limit,
							);
						}
					}

					if (operation === 'delete') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const responseId = this.getNodeParameter('responseId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/sites/${siteId}/surveys/${surveyId}/responses/${responseId}`,
						);
					}

					if (operation === 'getTrends') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/surveys/${surveyId}/responses/trends`,
							undefined,
							query,
						);
					}

					if (operation === 'bulkExport') {
						const surveyIds = (this.getNodeParameter('surveyIds', i) as string).split(',').map(id => id.trim());
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const exportOptions = this.getNodeParameter('exportOptions', i, {}) as IDataObject;
						const query = buildQueryParams({ ...filters, ...exportOptions });
						const limit = returnAll ? undefined : this.getNodeParameter('limit', i) as number;

						const allResponses: IDataObject[] = [];
						for (const surveyId of surveyIds) {
							const responses = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys/${surveyId}/responses`,
								query,
								limit,
							);
							allResponses.push(...responses.map(r => ({ ...r, surveyId })));
						}
						responseData = allResponses;
					}

					if (operation === 'filter') {
						const surveyId = this.getNodeParameter('surveyId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys/${surveyId}/responses`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/surveys/${surveyId}/responses`,
								query,
								limit,
							);
						}
					}
				}

				// Site Operations
				if (resource === 'site') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(this, 'GET', '/sites');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								'/sites',
								{},
								limit,
							);
						}
					}

					if (operation === 'get') {
						const siteId = this.getNodeParameter('siteId', i) as string;
						responseData = await hotjarApiRequest.call(this, 'GET', `/sites/${siteId}`);
					}

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const url = this.getNodeParameter('url', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { name, url, ...additionalFields };

						responseData = await hotjarApiRequest.call(this, 'POST', '/sites', body);
					}

					if (operation === 'update') {
						const siteId = this.getNodeParameter('siteId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						responseData = await hotjarApiRequest.call(
							this,
							'PATCH',
							`/sites/${siteId}`,
							updateFields,
						);
					}

					if (operation === 'delete') {
						const siteId = this.getNodeParameter('siteId', i) as string;
						responseData = await hotjarApiRequest.call(this, 'DELETE', `/sites/${siteId}`);
					}

					if (operation === 'getSettings') {
						const siteId = this.getNodeParameter('siteId', i) as string;
						responseData = await hotjarApiRequest.call(this, 'GET', `/sites/${siteId}/settings`);
					}

					if (operation === 'updateSettings') {
						const siteId = this.getNodeParameter('siteId', i) as string;
						const settings = JSON.parse(this.getNodeParameter('settings', i) as string);
						responseData = await hotjarApiRequest.call(
							this,
							'PATCH',
							`/sites/${siteId}/settings`,
							settings,
						);
					}

					if (operation === 'verify') {
						const siteId = this.getNodeParameter('siteId', i) as string;
						responseData = await hotjarApiRequest.call(this, 'GET', `/sites/${siteId}/verify`);
					}
				}

				// User Operations (GDPR)
				if (resource === 'user') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'lookup') {
						const lookupBy = this.getNodeParameter('lookupBy', i) as string;
						const lookupValue = this.getNodeParameter('lookupValue', i) as string;
						const query: IDataObject = { [lookupBy]: lookupValue };

						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/users/lookup`,
							undefined,
							query,
						);
					}

					if (operation === 'lookupByEmail') {
						const email = this.getNodeParameter('email', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/users/lookup`,
							undefined,
							{ email },
						);
					}

					if (operation === 'lookupByUserId') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/users/lookup`,
							undefined,
							{ user_id: userId },
						);
					}

					if (operation === 'delete') {
						const userId = this.getNodeParameter('userId', i) as string;
						const confirm = this.getNodeParameter('confirm', i) as boolean;

						if (!confirm) {
							throw new NodeOperationError(
								this.getNode(),
								'You must confirm the deletion by enabling the "Confirmation" toggle',
								{ itemIndex: i },
							);
						}

						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/users/${userId}/delete`,
						);
					}

					if (operation === 'bulkDelete') {
						const userIds = (this.getNodeParameter('userIds', i) as string).split(',').map(id => id.trim());
						const confirm = this.getNodeParameter('confirm', i) as boolean;

						if (!confirm) {
							throw new NodeOperationError(
								this.getNode(),
								'You must confirm the deletion by enabling the "Confirmation" toggle',
								{ itemIndex: i },
							);
						}

						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/users/bulk-delete`,
							{ user_ids: userIds },
						);
					}

					if (operation === 'getDeletionStatus') {
						const deletionRequestId = this.getNodeParameter('deletionRequestId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/deletion-requests/${deletionRequestId}`,
						);
					}

					if (operation === 'listDeletionRequests') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/deletion-requests`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/deletion-requests`,
								query,
								limit,
							);
						}
					}

					if (operation === 'cancelDeletion') {
						const deletionRequestId = this.getNodeParameter('deletionRequestId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/deletion-requests/${deletionRequestId}/cancel`,
						);
					}
				}

				// Recording Operations
				if (resource === 'recording') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'list' || operation === 'search') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/recordings`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/recordings`,
								query,
								limit,
							);
						}
					}

					if (operation === 'get') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/recordings/${recordingId}`,
						);
					}

					if (operation === 'delete') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/sites/${siteId}/recordings/${recordingId}`,
						);
					}

					if (operation === 'getPlaybackUrl') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/recordings/${recordingId}/playback-url`,
						);
					}

					if (operation === 'getEvents') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/recordings/${recordingId}/events`,
						);
					}

					if (operation === 'addTag') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const tag = this.getNodeParameter('tag', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/recordings/${recordingId}/tags`,
							{ tag },
						);
					}

					if (operation === 'removeTag') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const tag = this.getNodeParameter('tag', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/sites/${siteId}/recordings/${recordingId}/tags/${encodeURIComponent(tag)}`,
						);
					}

					if (operation === 'share') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const shareOptions = this.getNodeParameter('shareOptions', i, {}) as IDataObject;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/recordings/${recordingId}/share`,
							shareOptions,
						);
					}
				}

				// Heatmap Operations
				if (resource === 'heatmap') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/heatmaps`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/heatmaps`,
								query,
								limit,
							);
						}
					}

					if (operation === 'get') {
						const heatmapId = this.getNodeParameter('heatmapId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/heatmaps/${heatmapId}`,
						);
					}

					if (operation === 'create') {
						const pageUrl = this.getNodeParameter('pageUrl', i) as string;
						const type = this.getNodeParameter('type', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { page_url: pageUrl, type, ...additionalFields };

						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/heatmaps`,
							body,
						);
					}

					if (operation === 'update') {
						const heatmapId = this.getNodeParameter('heatmapId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						responseData = await hotjarApiRequest.call(
							this,
							'PATCH',
							`/sites/${siteId}/heatmaps/${heatmapId}`,
							updateFields,
						);
					}

					if (operation === 'delete') {
						const heatmapId = this.getNodeParameter('heatmapId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/sites/${siteId}/heatmaps/${heatmapId}`,
						);
					}

					if (operation === 'getData') {
						const heatmapId = this.getNodeParameter('heatmapId', i) as string;
						const dataOptions = this.getNodeParameter('dataOptions', i, {}) as IDataObject;
						const query = buildQueryParams(dataOptions);

						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/heatmaps/${heatmapId}/data`,
							undefined,
							query,
						);
					}

					if (operation === 'getScreenshot') {
						const heatmapId = this.getNodeParameter('heatmapId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/heatmaps/${heatmapId}/screenshot`,
						);
					}

					if (operation === 'refresh') {
						const heatmapId = this.getNodeParameter('heatmapId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/heatmaps/${heatmapId}/refresh`,
						);
					}
				}

				// Feedback Operations
				if (resource === 'feedback') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'list' || operation === 'export') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/feedback`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/feedback`,
								query,
								limit,
							);
						}
					}

					if (operation === 'get') {
						const feedbackId = this.getNodeParameter('feedbackId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/feedback/${feedbackId}`,
						);
					}

					if (operation === 'delete') {
						const feedbackId = this.getNodeParameter('feedbackId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/sites/${siteId}/feedback/${feedbackId}`,
						);
					}

					if (operation === 'getTrends') {
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query = buildQueryParams(filters);

						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/feedback/trends`,
							undefined,
							query,
						);
					}

					if (operation === 'getWidgetConfig') {
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/feedback/widget`,
						);
					}

					if (operation === 'updateWidget') {
						const widgetSettings = JSON.parse(this.getNodeParameter('widgetSettings', i) as string);
						responseData = await hotjarApiRequest.call(
							this,
							'PATCH',
							`/sites/${siteId}/feedback/widget`,
							widgetSettings,
						);
					}
				}

				// Funnel Operations
				if (resource === 'funnel') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/funnels`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/funnels`,
								{},
								limit,
							);
						}
					}

					if (operation === 'get') {
						const funnelId = this.getNodeParameter('funnelId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/funnels/${funnelId}`,
						);
					}

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const steps = JSON.parse(this.getNodeParameter('steps', i) as string);

						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/funnels`,
							{ name, steps },
						);
					}

					if (operation === 'update') {
						const funnelId = this.getNodeParameter('funnelId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.steps) body.steps = JSON.parse(updateFields.steps as string);

						responseData = await hotjarApiRequest.call(
							this,
							'PATCH',
							`/sites/${siteId}/funnels/${funnelId}`,
							body,
						);
					}

					if (operation === 'delete') {
						const funnelId = this.getNodeParameter('funnelId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/sites/${siteId}/funnels/${funnelId}`,
						);
					}

					if (operation === 'getAnalytics') {
						const funnelId = this.getNodeParameter('funnelId', i) as string;
						const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;
						const query = buildQueryParams(dateRange);

						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/funnels/${funnelId}/analytics`,
							undefined,
							query,
						);
					}

					if (operation === 'getRecordings') {
						const funnelId = this.getNodeParameter('funnelId', i) as string;
						const stepIndex = this.getNodeParameter('stepIndex', i) as number;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/funnels/${funnelId}/steps/${stepIndex}/recordings`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/funnels/${funnelId}/steps/${stepIndex}/recordings`,
								{},
								limit,
							);
						}
					}
				}

				// Event Operations
				if (resource === 'event') {
					const siteId = this.getNodeParameter('siteId', i) as string;

					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/events`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/events`,
								{},
								limit,
							);
						}
					}

					if (operation === 'get') {
						const eventName = this.getNodeParameter('eventName', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/events/${encodeURIComponent(eventName)}`,
						);
					}

					if (operation === 'getAnalytics') {
						const eventName = this.getNodeParameter('eventName', i) as string;
						const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const query: IDataObject = buildQueryParams(dateRange);
						if (options.attributes) {
							query.attributes = JSON.parse(options.attributes as string);
						}

						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/events/${encodeURIComponent(eventName)}/analytics`,
							undefined,
							query,
						);
					}

					if (operation === 'searchRecordings') {
						const eventName = this.getNodeParameter('eventName', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;
						const query = buildQueryParams(dateRange);

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/events/${encodeURIComponent(eventName)}/recordings`,
								query,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/events/${encodeURIComponent(eventName)}/recordings`,
								query,
								limit,
							);
						}
					}
				}

				// Organization Operations
				if (resource === 'organization') {
					const organizationId = this.getNodeParameter('organizationId', i) as string;

					if (operation === 'get') {
						responseData = await hotjarApiRequest.call(
							this,
							'GET',
							`/organizations/${organizationId}`,
						);
					}

					if (operation === 'listMembers') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/organizations/${organizationId}/members`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/organizations/${organizationId}/members`,
								{},
								limit,
							);
						}
					}

					if (operation === 'inviteMember') {
						const email = this.getNodeParameter('email', i) as string;
						const role = this.getNodeParameter('role', i) as string;

						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/organizations/${organizationId}/members`,
							{ email, role },
						);
					}

					if (operation === 'updateMemberRole') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const role = this.getNodeParameter('role', i) as string;

						responseData = await hotjarApiRequest.call(
							this,
							'PATCH',
							`/organizations/${organizationId}/members/${memberId}`,
							{ role },
						);
					}

					if (operation === 'removeMember') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/organizations/${organizationId}/members/${memberId}`,
						);
					}

					if (operation === 'listApiKeys') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/organizations/${organizationId}/api-keys`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await hotjarApiRequestAllItems.call(
								this,
								'GET',
								`/organizations/${organizationId}/api-keys`,
								{},
								limit,
							);
						}
					}

					if (operation === 'createApiKey') {
						const apiKeyName = this.getNodeParameter('apiKeyName', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'POST',
							`/organizations/${organizationId}/api-keys`,
							{ name: apiKeyName },
						);
					}

					if (operation === 'revokeApiKey') {
						const apiKeyId = this.getNodeParameter('apiKeyId', i) as string;
						responseData = await hotjarApiRequest.call(
							this,
							'DELETE',
							`/organizations/${organizationId}/api-keys/${apiKeyId}`,
						);
					}
				}

				// Process response data
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
