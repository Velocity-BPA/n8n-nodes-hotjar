/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Hotjar } from '../nodes/Hotjar/Hotjar.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Hotjar Node', () => {
  let node: Hotjar;

  beforeAll(() => {
    node = new Hotjar();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Hotjar');
      expect(node.description.name).toBe('hotjar');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Site Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://insights.hotjar.com/api/v2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAllSites operation', () => {
    it('should retrieve all sites successfully', async () => {
      const mockSites = [
        { id: 123456, name: 'Test Site 1' },
        { id: 789012, name: 'Test Site 2' }
      ];
      
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllSites');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSites);

      const result = await executeSiteOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://insights.hotjar.com/api/v2/sites',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
      expect(result).toEqual([{ json: mockSites, pairedItem: { item: 0 } }]);
    });

    it('should handle getAllSites error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllSites');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSiteOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getSite operation', () => {
    it('should retrieve specific site successfully', async () => {
      const mockSite = { id: 123456, name: 'Test Site' };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSite')
        .mockReturnValueOnce('123456');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSite);

      const result = await executeSiteOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://insights.hotjar.com/api/v2/sites/123456',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
      expect(result).toEqual([{ json: mockSite, pairedItem: { item: 0 } }]);
    });

    it('should handle getSite error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSite')
        .mockReturnValueOnce('123456');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Site not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSiteOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Site not found' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Survey Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://insights.hotjar.com/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAllSurveys operation', () => {
		it('should retrieve all surveys successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllSurveys')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				surveys: [{ id: 1, name: 'Test Survey' }],
			});

			const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://insights.hotjar.com/api/v2/sites/123/surveys',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				qs: { limit: 20, offset: 0 },
				json: true,
			});

			expect(result).toEqual([
				{
					json: { surveys: [{ id: 1, name: 'Test Survey' }] },
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors gracefully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllSurveys');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getSurvey operation', () => {
		it('should retrieve a specific survey successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getSurvey')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('456');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 456,
				name: 'Test Survey',
			});

			const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://insights.hotjar.com/api/v2/sites/123/surveys/456',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { id: 456, name: 'Test Survey' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('createSurvey operation', () => {
		it('should create a survey successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createSurvey')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('New Survey')
				.mockReturnValueOnce('{"url_pattern": "example.com"}')
				.mockReturnValueOnce('[{"type": "text", "question": "How are you?"}]');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 789,
				name: 'New Survey',
			});

			const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://insights.hotjar.com/api/v2/sites/123/surveys',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'New Survey',
					targeting_rules: { url_pattern: 'example.com' },
					questions: [{ type: 'text', question: 'How are you?' }],
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { id: 789, name: 'New Survey' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('updateSurvey operation', () => {
		it('should update a survey successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateSurvey')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('456')
				.mockReturnValueOnce('Updated Survey')
				.mockReturnValueOnce('{"url_pattern": "updated.com"}')
				.mockReturnValueOnce('[{"type": "rating", "question": "Rate us"}]');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 456,
				name: 'Updated Survey',
			});

			const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://insights.hotjar.com/api/v2/sites/123/surveys/456',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Updated Survey',
					targeting_rules: { url_pattern: 'updated.com' },
					questions: [{ type: 'rating', question: 'Rate us' }],
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { id: 456, name: 'Updated Survey' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('deleteSurvey operation', () => {
		it('should delete a survey successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteSurvey')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('456');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				success: true,
			});

			const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://insights.hotjar.com/api/v2/sites/123/surveys/456',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { success: true },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('SurveyResponse Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAllResponses operation', () => {
		it('should get all responses successfully', async () => {
			const mockResponse = {
				responses: [
					{ id: '1', survey_id: 'survey1', created_datetime: '2023-01-01T00:00:00Z' },
					{ id: '2', survey_id: 'survey1', created_datetime: '2023-01-02T00:00:00Z' }
				],
				total: 2
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllResponses')
				.mockReturnValueOnce('12345')
				.mockReturnValueOnce('survey-123')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSurveyResponseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://insights.hotjar.com/api/v2/sites/12345/surveys/survey-123/responses?limit=100&offset=0',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle getAllResponses error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllResponses')
				.mockReturnValueOnce('12345')
				.mockReturnValueOnce('survey-123')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSurveyResponseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getResponse operation', () => {
		it('should get specific response successfully', async () => {
			const mockResponse = {
				id: 'response-123',
				survey_id: 'survey-123',
				created_datetime: '2023-01-01T00:00:00Z',
				responses: [{ question_id: 'q1', answer: 'Great service!' }]
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getResponse')
				.mockReturnValueOnce('12345')
				.mockReturnValueOnce('survey-123')
				.mockReturnValueOnce('response-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSurveyResponseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://insights.hotjar.com/api/v2/sites/12345/surveys/survey-123/responses/response-123',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle getResponse error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getResponse')
				.mockReturnValueOnce('12345')
				.mockReturnValueOnce('survey-123')
				.mockReturnValueOnce('response-123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Response not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(false);

			await expect(executeSurveyResponseOperations.call(mockExecuteFunctions, [{ json: {} }]))
				.rejects.toThrow('Response not found');
		});
	});
});

describe('Recording Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get all recordings successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllRecordings')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      recordings: [{ id: '1', duration: 300 }]
    });

    const items = [{ json: {} }];
    const result = await executeRecordingOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: { recordings: [{ id: '1', duration: 300 }] },
      pairedItem: { item: 0 }
    }]);
  });

  it('should get specific recording successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRecording')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('rec456');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'rec456',
      duration: 300,
      created_datetime: '2023-01-01T00:00:00Z'
    });

    const items = [{ json: {} }];
    const result = await executeRecordingOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: { id: 'rec456', duration: 300, created_datetime: '2023-01-01T00:00:00Z' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should delete recording successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteRecording')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('rec456');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      message: 'Recording deletion initiated'
    });

    const items = [{ json: {} }];
    const result = await executeRecordingOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: { message: 'Recording deletion initiated' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRecording')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('invalid');
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Recording not found'));

    const items = [{ json: {} }];
    const result = await executeRecordingOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: { error: 'Recording not found' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRecording')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('invalid');
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Recording not found'));

    const items = [{ json: {} }];

    await expect(
      executeRecordingOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Recording not found');
  });
});

describe('Heatmap Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://insights.hotjar.com/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get all heatmaps successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllHeatmaps')
			.mockReturnValueOnce('site123')
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(0);

		const mockResponse = { heatmaps: [{ id: '1', name: 'Test Heatmap' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeHeatmapOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://insights.hotjar.com/api/v2/sites/site123/heatmaps',
			headers: {
				Authorization: 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			qs: { limit: 50, offset: 0 },
			json: true,
		});
	});

	it('should get specific heatmap successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getHeatmap')
			.mockReturnValueOnce('site123')
			.mockReturnValueOnce('heatmap456');

		const mockResponse = { id: 'heatmap456', name: 'Test Heatmap' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeHeatmapOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://insights.hotjar.com/api/v2/sites/site123/heatmaps/heatmap456',
			headers: {
				Authorization: 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should create heatmap successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createHeatmap')
			.mockReturnValueOnce('site123')
			.mockReturnValueOnce('New Heatmap')
			.mockReturnValueOnce('/products/*');

		const mockResponse = { id: 'new123', name: 'New Heatmap', url_pattern: '/products/*' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeHeatmapOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://insights.hotjar.com/api/v2/sites/site123/heatmaps',
			headers: {
				Authorization: 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'New Heatmap',
				url_pattern: '/products/*',
			},
			json: true,
		});
	});

	it('should handle errors with continueOnFail', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllHeatmaps');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeHeatmapOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllHeatmaps');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeHeatmapOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});
});

describe('Data Subject Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://insights.hotjar.com/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createDeletionRequest', () => {
		it('should create deletion request successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createDeletionRequest')
				.mockReturnValueOnce('123456')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('full');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'req123',
				status: 'pending',
				user_id: 'user123',
				deletion_type: 'full',
			});

			const result = await executeDataSubjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://insights.hotjar.com/api/v2/sites/123456/data-subjects/deletion-requests',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					user_id: 'user123',
					deletion_type: 'full',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('req123');
		});

		it('should handle createDeletionRequest error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createDeletionRequest')
				.mockReturnValueOnce('123456')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('full');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeDataSubjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getAllDeletionRequests', () => {
		it('should get all deletion requests successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllDeletionRequests')
				.mockReturnValueOnce('123456')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('pending');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				data: [
					{ id: 'req1', status: 'pending' },
					{ id: 'req2', status: 'pending' },
				],
				total: 2,
			});

			const result = await executeDataSubjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://insights.hotjar.com/api/v2/sites/123456/data-subjects/deletion-requests?limit=20&offset=0&status=pending',
				headers: {
					Authorization: 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json.data).toHaveLength(2);
		});

		it('should handle getAllDeletionRequests error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllDeletionRequests')
				.mockReturnValueOnce('123456')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeDataSubjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getDeletionRequest', () => {
		it('should get deletion request successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDeletionRequest')
				.mockReturnValueOnce('123456')
				.mockReturnValueOnce('req123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'req123',
				status: 'completed',
				user_id: 'user123',
				deletion_type: 'full',
			});

			const result = await executeDataSubjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://insights.hotjar.com/api/v2/sites/123456/data-subjects/deletion-requests/req123',
				headers: {
					Authorization: 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('req123');
		});

		it('should handle getDeletionRequest error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDeletionRequest')
				.mockReturnValueOnce('123456')
				.mockReturnValueOnce('req123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeDataSubjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});
});
});
