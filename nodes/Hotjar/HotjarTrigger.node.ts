/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

export class HotjarTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hotjar Trigger',
		name: 'hotjarTrigger',
		icon: 'file:hotjar.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Receive Hotjar events via webhooks',
		defaults: {
			name: 'Hotjar Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'hotjarApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Feedback Received',
						value: 'feedback.received',
						description: 'Triggered when new feedback is submitted',
					},
					{
						name: 'Heatmap Data Ready',
						value: 'heatmap.data.ready',
						description: 'Triggered when heatmap data is generated',
					},
					{
						name: 'Recording Completed',
						value: 'recording.completed',
						description: 'Triggered when a recording session ends',
					},
					{
						name: 'Survey Response Created',
						value: 'survey.response.created',
						description: 'Triggered when a new survey response is received',
					},
					{
						name: 'User Deletion Completed',
						value: 'user.deletion.completed',
						description: 'Triggered when user deletion is finished',
					},
				],
				default: 'survey.response.created',
				description: 'The Hotjar event to listen for',
			},
			{
				displayName: 'Site ID',
				name: 'siteId',
				type: 'string',
				required: true,
				default: '',
				description: 'The Hotjar site ID to receive events from',
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Note: Webhook Configuration',
				name: 'webhookNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						event: [
							'survey.response.created',
							'feedback.received',
							'recording.completed',
							'user.deletion.completed',
							'heatmap.data.ready',
						],
					},
				},
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Hotjar webhooks are configured in the dashboard
				// This method checks if the webhook is already registered
				// For now, we assume it needs to be set up manually
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Hotjar webhooks need to be configured in the Hotjar dashboard
				// This returns the webhook URL that should be configured there
				const webhookUrl = this.getNodeWebhookUrl('default');
				console.log(`Configure this webhook URL in your Hotjar dashboard: ${webhookUrl}`);
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Webhooks need to be removed from Hotjar dashboard manually
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const event = this.getNodeParameter('event') as string;

		// Verify the event type matches what we're listening for
		const receivedEvent = body.event as string;
		if (receivedEvent && receivedEvent !== event) {
			// Event doesn't match, ignore it
			return {
				noWebhookResponse: true,
			};
		}

		// Return the webhook data
		return {
			workflowData: [
				this.helpers.returnJsonArray({
					event: receivedEvent || event,
					timestamp: new Date().toISOString(),
					headers: req.headers,
					body,
				}),
			],
		};
	}
}
