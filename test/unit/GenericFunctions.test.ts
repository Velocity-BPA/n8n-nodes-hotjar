/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { formatDate, buildQueryParams } from '../../nodes/Hotjar/GenericFunctions';

describe('GenericFunctions', () => {
  describe('formatDate', () => {
    it('should format Date object to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should format valid ISO string', () => {
      const dateStr = '2024-01-15T10:30:00Z';
      const result = formatDate(dateStr);
      expect(result).toContain('2024-01-15');
    });

    it('should format date-only string', () => {
      const dateStr = '2024-01-15';
      const result = formatDate(dateStr);
      expect(result).toContain('2024-01-15');
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date format');
    });
  });

  describe('buildQueryParams', () => {
    it('should return empty object for empty input', () => {
      const result = buildQueryParams({});
      expect(result).toEqual({});
    });

    it('should filter out undefined and null values', () => {
      const params = {
        key1: 'value1',
        key2: undefined,
        key3: null,
        key4: 'value4',
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({
        key1: 'value1',
        key4: 'value4',
      });
    });

    it('should filter out empty strings', () => {
      const params = {
        key1: 'value1',
        key2: '',
        key3: 'value3',
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({
        key1: 'value1',
        key3: 'value3',
      });
    });

    it('should convert camelCase to snake_case', () => {
      const params = {
        siteId: '123',
        userId: '456',
        maxResults: 10,
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({
        site_id: '123',
        user_id: '456',
        max_results: 10,
      });
    });

    it('should handle dateFrom and dateTo specially', () => {
      const params = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };
      const result = buildQueryParams(params);
      expect(result.date_from).toBeDefined();
      expect(result.date_to).toBeDefined();
    });

    it('should preserve numeric values', () => {
      const params = {
        limit: 50,
        offset: 0,
      };
      const result = buildQueryParams(params);
      expect(result.limit).toBe(50);
      expect(result.offset).toBe(0);
    });

    it('should preserve boolean values', () => {
      const params = {
        active: true,
        archived: false,
      };
      const result = buildQueryParams(params);
      expect(result.active).toBe(true);
      expect(result.archived).toBe(false);
    });
  });
});
