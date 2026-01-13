/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export class NodeApiError extends Error {
  constructor(
    public node: any,
    public error: any,
    public options?: any,
  ) {
    super(options?.message || error?.message || 'API Error');
    this.name = 'NodeApiError';
  }
}

export class NodeOperationError extends Error {
  constructor(
    public node: any,
    message: string,
    public options?: any,
  ) {
    super(message);
    this.name = 'NodeOperationError';
  }
}

export interface IDataObject {
  [key: string]: any;
}

export interface INodeExecutionData {
  json: IDataObject;
  binary?: any;
  pairedItem?: any;
}

export interface INodeType {
  description: INodeTypeDescription;
  execute?(this: any): Promise<INodeExecutionData[][]>;
}

export interface INodeTypeDescription {
  displayName: string;
  name: string;
  icon?: string;
  group: string[];
  version: number;
  subtitle?: string;
  description: string;
  defaults: {
    name: string;
  };
  inputs: string[];
  outputs: string[];
  credentials?: Array<{
    name: string;
    required: boolean;
  }>;
  properties: any[];
}

export interface ICredentialType {
  name: string;
  displayName: string;
  documentationUrl?: string;
  properties: any[];
  authenticate?: any;
  test?: any;
}

export type IHttpRequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IRequestOptions {
  method: IHttpRequestMethods;
  uri: string;
  headers?: Record<string, string>;
  qs?: any;
  body?: any;
  form?: any;
  json?: boolean;
}

export interface INodeProperties {
  displayName: string;
  name: string;
  type: string;
  default: any;
  required?: boolean;
  description?: string;
  options?: any[];
  displayOptions?: any;
  typeOptions?: any;
  placeholder?: string;
  noDataExpression?: boolean;
}

export interface INodePropertyOptions {
  name: string;
  value: string | number;
}

export type JsonObject = Record<string, any>;
