/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { HotjarTrigger } from '../../nodes/Hotjar/HotjarTrigger.node';

describe('HotjarTrigger Node', () => {
  let hotjarTrigger: HotjarTrigger;

  beforeEach(() => {
    hotjarTrigger = new HotjarTrigger();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(hotjarTrigger.description.displayName).toBe('Hotjar Trigger');
    });

    it('should have correct name', () => {
      expect(hotjarTrigger.description.name).toBe('hotjarTrigger');
    });

    it('should have correct version', () => {
      expect(hotjarTrigger.description.version).toBe(1);
    });

    it('should be in trigger group', () => {
      expect(hotjarTrigger.description.group).toContain('trigger');
    });

    it('should require hotjarApi credentials', () => {
      const credentials = hotjarTrigger.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials![0].name).toBe('hotjarApi');
      expect(credentials![0].required).toBe(true);
    });

    it('should have no inputs and one output', () => {
      expect(hotjarTrigger.description.inputs).toEqual([]);
      expect(hotjarTrigger.description.outputs).toEqual(['main']);
    });

    it('should have webhook configured', () => {
      expect(hotjarTrigger.description.webhooks).toBeDefined();
      expect(hotjarTrigger.description.webhooks).toHaveLength(1);
      expect(hotjarTrigger.description.webhooks![0].httpMethod).toBe('POST');
      expect(hotjarTrigger.description.webhooks![0].path).toBe('webhook');
    });
  });

  describe('Events', () => {
    it('should have event property', () => {
      const eventProperty = hotjarTrigger.description.properties.find(
        (p) => p.name === 'event',
      );
      expect(eventProperty).toBeDefined();
      expect(eventProperty?.type).toBe('options');
      expect(eventProperty?.required).toBe(true);
    });

    it('should have all supported events', () => {
      const eventProperty = hotjarTrigger.description.properties.find(
        (p) => p.name === 'event',
      );
      expect(eventProperty).toBeDefined();

      const events = eventProperty?.options?.map((o: any) => o.value);
      expect(events).toContain('survey.response.created');
      expect(events).toContain('feedback.received');
      expect(events).toContain('recording.completed');
      expect(events).toContain('user.deletion.completed');
      expect(events).toContain('heatmap.data.ready');
    });

    it('should have siteId property', () => {
      const siteIdProperty = hotjarTrigger.description.properties.find(
        (p) => p.name === 'siteId',
      );
      expect(siteIdProperty).toBeDefined();
      expect(siteIdProperty?.type).toBe('string');
      expect(siteIdProperty?.required).toBe(true);
    });
  });

  describe('Webhook Methods', () => {
    it('should have webhookMethods defined', () => {
      expect(hotjarTrigger.webhookMethods).toBeDefined();
      expect(hotjarTrigger.webhookMethods.default).toBeDefined();
    });

    it('should have checkExists method', () => {
      expect(hotjarTrigger.webhookMethods.default.checkExists).toBeDefined();
      expect(typeof hotjarTrigger.webhookMethods.default.checkExists).toBe('function');
    });

    it('should have create method', () => {
      expect(hotjarTrigger.webhookMethods.default.create).toBeDefined();
      expect(typeof hotjarTrigger.webhookMethods.default.create).toBe('function');
    });

    it('should have delete method', () => {
      expect(hotjarTrigger.webhookMethods.default.delete).toBeDefined();
      expect(typeof hotjarTrigger.webhookMethods.default.delete).toBe('function');
    });
  });

  describe('Webhook Handler', () => {
    it('should have webhook method', () => {
      expect(hotjarTrigger.webhook).toBeDefined();
      expect(typeof hotjarTrigger.webhook).toBe('function');
    });
  });
});
