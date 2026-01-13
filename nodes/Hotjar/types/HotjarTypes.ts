/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface IHotjarCredentials {
	clientId: string;
	clientSecret: string;
}

export interface IHotjarTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface IHotjarPaginatedResponse<T> {
	results: T[];
	next_cursor: string | null;
	total_count?: number;
}

export interface IHotjarSite {
	id: number;
	name: string;
	url: string;
	created_at: string;
	tracking_code_installed: boolean;
	timezone?: string;
	sampling_rate?: number;
}

export interface IHotjarSurvey {
	id: number;
	site_id: number;
	name: string;
	status: 'draft' | 'active' | 'paused' | 'completed';
	type: 'poll' | 'survey' | 'feedback';
	created_at: string;
	updated_at: string;
	questions: IHotjarSurveyQuestion[];
	targeting?: IDataObject;
	appearance?: IDataObject;
}

export interface IHotjarSurveyQuestion {
	id: number;
	type: string;
	text: string;
	required: boolean;
	options?: string[];
}

export interface IHotjarSurveyResponse {
	id: string;
	survey_id: number;
	site_id: number;
	user_id: string;
	created_at: string;
	answers: IHotjarSurveyAnswer[];
	metadata: IDataObject;
}

export interface IHotjarSurveyAnswer {
	question_id: number;
	question_text: string;
	answer: string | string[] | number;
}

export interface IHotjarRecording {
	id: string;
	site_id: number;
	user_id: string;
	duration: number;
	page_count: number;
	created_at: string;
	country: string;
	device: string;
	browser: string;
	os: string;
	url: string;
	tags?: string[];
}

export interface IHotjarHeatmap {
	id: string;
	site_id: number;
	name: string;
	url: string;
	type: 'click' | 'move' | 'scroll';
	status: 'active' | 'paused' | 'completed';
	created_at: string;
	sample_size: number;
	device?: string;
}

export interface IHotjarUser {
	id: string;
	site_id: number;
	user_id: string;
	email?: string;
	created_at: string;
	last_seen_at: string;
	recordings_count: number;
	surveys_count: number;
}

export interface IHotjarDeletionRequest {
	id: string;
	site_id: number;
	user_id: string;
	status: 'pending' | 'processing' | 'completed' | 'failed';
	created_at: string;
	completed_at?: string;
}

export interface IHotjarFeedback {
	id: string;
	site_id: number;
	page_url: string;
	emotion: 'happy' | 'neutral' | 'sad' | 'angry' | 'confused';
	message?: string;
	screenshot_url?: string;
	created_at: string;
	user_id?: string;
}

export interface IHotjarFunnel {
	id: number;
	site_id: number;
	name: string;
	steps: IHotjarFunnelStep[];
	created_at: string;
	updated_at: string;
}

export interface IHotjarFunnelStep {
	name: string;
	url_pattern: string;
	match_type: 'exact' | 'contains' | 'regex';
}

export interface IHotjarFunnelAnalytics {
	funnel_id: number;
	total_sessions: number;
	conversion_rate: number;
	steps: IHotjarFunnelStepAnalytics[];
}

export interface IHotjarFunnelStepAnalytics {
	step_index: number;
	name: string;
	sessions: number;
	drop_off_rate: number;
}

export interface IHotjarEvent {
	name: string;
	site_id: number;
	occurrence_count: number;
	first_seen_at: string;
	last_seen_at: string;
	attributes?: IDataObject;
}

export interface IHotjarOrganization {
	id: string;
	name: string;
	created_at: string;
	plan: string;
	sites_count: number;
	members_count: number;
}

export interface IHotjarOrganizationMember {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'member' | 'viewer';
	joined_at: string;
	last_login_at?: string;
}

export interface IHotjarApiKey {
	id: string;
	name: string;
	created_at: string;
	last_used_at?: string;
	client_id: string;
}

export interface IHotjarApiError {
	error: {
		code: string;
		message: string;
	};
}

export type HotjarResource = 
	| 'survey' 
	| 'response' 
	| 'site' 
	| 'user' 
	| 'recording' 
	| 'heatmap' 
	| 'feedback' 
	| 'funnel' 
	| 'event' 
	| 'organization';

export type SurveyOperation = 
	| 'list' 
	| 'get' 
	| 'create' 
	| 'update' 
	| 'delete' 
	| 'publish' 
	| 'unpublish' 
	| 'duplicate' 
	| 'getAnalytics' 
	| 'listQuestions';

export type ResponseOperation = 
	| 'list' 
	| 'get' 
	| 'export' 
	| 'delete' 
	| 'getTrends' 
	| 'bulkExport' 
	| 'filter';

export type SiteOperation = 
	| 'list' 
	| 'get' 
	| 'create' 
	| 'update' 
	| 'delete' 
	| 'getSettings' 
	| 'updateSettings' 
	| 'verify';

export type UserOperation = 
	| 'lookup' 
	| 'lookupByEmail' 
	| 'lookupByUserId' 
	| 'delete' 
	| 'bulkDelete' 
	| 'getDeletionStatus' 
	| 'listDeletionRequests' 
	| 'cancelDeletion';

export type RecordingOperation = 
	| 'list' 
	| 'get' 
	| 'delete' 
	| 'getPlaybackUrl' 
	| 'getEvents' 
	| 'search' 
	| 'addTag' 
	| 'removeTag' 
	| 'share';

export type HeatmapOperation = 
	| 'list' 
	| 'get' 
	| 'create' 
	| 'update' 
	| 'delete' 
	| 'getData' 
	| 'getScreenshot' 
	| 'refresh';

export type FeedbackOperation = 
	| 'list' 
	| 'get' 
	| 'delete' 
	| 'export' 
	| 'getTrends' 
	| 'getWidgetConfig' 
	| 'updateWidget';

export type FunnelOperation = 
	| 'list' 
	| 'get' 
	| 'create' 
	| 'update' 
	| 'delete' 
	| 'getAnalytics' 
	| 'getRecordings';

export type EventOperation = 
	| 'list' 
	| 'get' 
	| 'getAnalytics' 
	| 'searchRecordings';

export type OrganizationOperation = 
	| 'get' 
	| 'listMembers' 
	| 'inviteMember' 
	| 'updateMemberRole' 
	| 'removeMember' 
	| 'listApiKeys' 
	| 'createApiKey' 
	| 'revokeApiKey';
