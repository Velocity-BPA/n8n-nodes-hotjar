/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { HotjarApi } from '../../credentials/HotjarApi.credentials';

describe('HotjarApi Credentials', () => {
  let credentials: HotjarApi;

  beforeEach(() => {
    credentials = new HotjarApi();
  });

  describe('Credential Definition', () => {
    it('should have correct name', () => {
      expect(credentials.name).toBe('hotjarApi');
    });

    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('Hotjar API');
    });

    it('should have documentation URL', () => {
      expect(credentials.documentationUrl).toBeDefined();
      expect(credentials.documentationUrl).toContain('hotjar');
    });
  });

  describe('Properties', () => {
    it('should have clientId property', () => {
      const clientIdProp = credentials.properties.find(
        (p) => p.name === 'clientId',
      );
      expect(clientIdProp).toBeDefined();
      expect(clientIdProp?.type).toBe('string');
      expect(clientIdProp?.required).toBe(true);
    });

    it('should have clientSecret property', () => {
      const clientSecretProp = credentials.properties.find(
        (p) => p.name === 'clientSecret',
      );
      expect(clientSecretProp).toBeDefined();
      expect(clientSecretProp?.type).toBe('string');
      expect(clientSecretProp?.required).toBe(true);
      expect(clientSecretProp?.typeOptions?.password).toBe(true);
    });
  });

  describe('Authentication', () => {
    it('should have authenticate configuration', () => {
      expect(credentials.authenticate).toBeDefined();
      expect(credentials.authenticate.type).toBe('generic');
    });
  });

  describe('Test Configuration', () => {
    it('should have test configuration', () => {
      expect(credentials.test).toBeDefined();
      expect(credentials.test.request).toBeDefined();
      expect(credentials.test.request.baseURL).toBe('https://api.hotjar.io');
      expect(credentials.test.request.method).toBe('GET');
    });
  });
});
