/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Hotjar } from '../../nodes/Hotjar/Hotjar.node';

describe('Hotjar Node', () => {
  let hotjar: Hotjar;

  beforeEach(() => {
    hotjar = new Hotjar();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(hotjar.description.displayName).toBe('Hotjar');
    });

    it('should have correct name', () => {
      expect(hotjar.description.name).toBe('hotjar');
    });

    it('should have correct version', () => {
      expect(hotjar.description.version).toBe(1);
    });

    it('should have correct group', () => {
      expect(hotjar.description.group).toContain('transform');
    });

    it('should require hotjarApi credentials', () => {
      const credentials = hotjar.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials![0].name).toBe('hotjarApi');
      expect(credentials![0].required).toBe(true);
    });

    it('should have correct inputs and outputs', () => {
      expect(hotjar.description.inputs).toEqual(['main']);
      expect(hotjar.description.outputs).toEqual(['main']);
    });
  });

  describe('Resources', () => {
    it('should have 10 resources', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty?.options).toHaveLength(10);
    });

    it('should have survey resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const surveyOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'survey',
      );
      expect(surveyOption).toBeDefined();
      expect(surveyOption?.name).toBe('Survey');
    });

    it('should have response resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const responseOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'response',
      );
      expect(responseOption).toBeDefined();
      expect(responseOption?.name).toBe('Survey Response');
    });

    it('should have site resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const siteOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'site',
      );
      expect(siteOption).toBeDefined();
      expect(siteOption?.name).toBe('Site');
    });

    it('should have user resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const userOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'user',
      );
      expect(userOption).toBeDefined();
      expect(userOption?.name).toBe('User (GDPR)');
    });

    it('should have recording resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const recordingOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'recording',
      );
      expect(recordingOption).toBeDefined();
      expect(recordingOption?.name).toBe('Recording');
    });

    it('should have heatmap resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const heatmapOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'heatmap',
      );
      expect(heatmapOption).toBeDefined();
      expect(heatmapOption?.name).toBe('Heatmap');
    });

    it('should have feedback resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const feedbackOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'feedback',
      );
      expect(feedbackOption).toBeDefined();
      expect(feedbackOption?.name).toBe('Feedback');
    });

    it('should have funnel resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const funnelOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'funnel',
      );
      expect(funnelOption).toBeDefined();
      expect(funnelOption?.name).toBe('Funnel');
    });

    it('should have event resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const eventOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'event',
      );
      expect(eventOption).toBeDefined();
      expect(eventOption?.name).toBe('Event');
    });

    it('should have organization resource', () => {
      const resourceProperty = hotjar.description.properties.find(
        (p) => p.name === 'resource',
      );
      const organizationOption = resourceProperty?.options?.find(
        (o: any) => o.value === 'organization',
      );
      expect(organizationOption).toBeDefined();
      expect(organizationOption?.name).toBe('Organization');
    });
  });

  describe('Survey Operations', () => {
    it('should have all survey operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'survey',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('create');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
      expect(operations).toContain('publish');
      expect(operations).toContain('unpublish');
      expect(operations).toContain('duplicate');
      expect(operations).toContain('getAnalytics');
      expect(operations).toContain('listQuestions');
    });
  });

  describe('Response Operations', () => {
    it('should have all response operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'response',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('export');
      expect(operations).toContain('delete');
      expect(operations).toContain('getTrends');
      expect(operations).toContain('bulkExport');
      expect(operations).toContain('filter');
    });
  });

  describe('Site Operations', () => {
    it('should have all site operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'site',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('create');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
      expect(operations).toContain('getSettings');
      expect(operations).toContain('updateSettings');
      expect(operations).toContain('verify');
    });
  });

  describe('User Operations', () => {
    it('should have all user operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'user',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('lookup');
      expect(operations).toContain('lookupByEmail');
      expect(operations).toContain('lookupByUserId');
      expect(operations).toContain('delete');
      expect(operations).toContain('bulkDelete');
      expect(operations).toContain('getDeletionStatus');
      expect(operations).toContain('listDeletionRequests');
      expect(operations).toContain('cancelDeletion');
    });
  });

  describe('Recording Operations', () => {
    it('should have all recording operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'recording',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('delete');
      expect(operations).toContain('getPlaybackUrl');
      expect(operations).toContain('getEvents');
      expect(operations).toContain('search');
      expect(operations).toContain('addTag');
      expect(operations).toContain('removeTag');
      expect(operations).toContain('share');
    });
  });

  describe('Heatmap Operations', () => {
    it('should have all heatmap operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'heatmap',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('create');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
      expect(operations).toContain('getData');
      expect(operations).toContain('getScreenshot');
      expect(operations).toContain('refresh');
    });
  });

  describe('Feedback Operations', () => {
    it('should have all feedback operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'feedback',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('delete');
      expect(operations).toContain('export');
      expect(operations).toContain('getTrends');
      expect(operations).toContain('getWidgetConfig');
      expect(operations).toContain('updateWidget');
    });
  });

  describe('Funnel Operations', () => {
    it('should have all funnel operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'funnel',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('create');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
      expect(operations).toContain('getAnalytics');
      expect(operations).toContain('getRecordings');
    });
  });

  describe('Event Operations', () => {
    it('should have all event operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'event',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('list');
      expect(operations).toContain('get');
      expect(operations).toContain('getAnalytics');
      expect(operations).toContain('searchRecordings');
    });
  });

  describe('Organization Operations', () => {
    it('should have all organization operations', () => {
      const operationProperty = hotjar.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.[0] === 'organization',
      );
      expect(operationProperty).toBeDefined();

      const operations = operationProperty?.options?.map((o: any) => o.value);
      expect(operations).toContain('get');
      expect(operations).toContain('listMembers');
      expect(operations).toContain('inviteMember');
      expect(operations).toContain('updateMemberRole');
      expect(operations).toContain('removeMember');
      expect(operations).toContain('listApiKeys');
      expect(operations).toContain('createApiKey');
      expect(operations).toContain('revokeApiKey');
    });
  });
});
