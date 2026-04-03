# n8n-nodes-hotjar

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with Hotjar's user behavior analytics platform. This node provides access to 6 core resources including sites, surveys, recordings, heatmaps, and data subject management capabilities, enabling automated workflows for user experience optimization and analytics data collection.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Hotjar API](https://img.shields.io/badge/Hotjar-API%20v1-orange)
![Analytics](https://img.shields.io/badge/Analytics-User%20Behavior-purple)
![GDPR Ready](https://img.shields.io/badge/GDPR-Compliant-green)

## Features

- **Site Management** - Create, update, and manage Hotjar site configurations and tracking settings
- **Survey Operations** - Automate survey creation, deployment, and response collection workflows
- **Recording Analysis** - Access and process user session recordings with filtering and export capabilities
- **Heatmap Data** - Retrieve heatmap analytics data for page optimization and user behavior insights
- **Response Processing** - Extract and analyze survey responses with automatic data transformation
- **GDPR Compliance** - Manage data subject requests, user data deletion, and privacy compliance workflows
- **Bulk Operations** - Process multiple analytics records efficiently with batch operations
- **Real-time Integration** - Connect Hotjar insights to other tools in your analytics and optimization stack

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-hotjar`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-hotjar
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-hotjar.git
cd n8n-nodes-hotjar
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-hotjar
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Hotjar API key from account settings | Yes |
| Base URL | Hotjar API base URL (auto-configured) | No |

## Resources & Operations

### 1. Site

| Operation | Description |
|-----------|-------------|
| Create | Create a new site configuration in Hotjar |
| Get | Retrieve site details and configuration |
| Get All | List all sites in your Hotjar account |
| Update | Modify site settings and configuration |
| Delete | Remove a site from Hotjar |

### 2. Survey

| Operation | Description |
|-----------|-------------|
| Create | Create a new survey with questions and targeting |
| Get | Retrieve survey configuration and settings |
| Get All | List all surveys for a site |
| Update | Modify survey questions, targeting, or status |
| Delete | Remove a survey |
| Start | Activate a survey for data collection |
| Stop | Pause or deactivate a survey |

### 3. Survey Response

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific survey response |
| Get All | Fetch all responses for a survey with filtering |
| Export | Export survey responses in various formats |
| Analyze | Get aggregated response analytics and insights |

### 4. Recording

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific user session recording |
| Get All | List recordings with filtering by date, page, or user |
| Download | Download recording files for offline analysis |
| Get Insights | Extract key insights and events from recordings |
| Filter | Apply advanced filters to recording datasets |

### 5. Heatmap

| Operation | Description |
|-----------|-------------|
| Get | Retrieve heatmap data for a specific page |
| Get All | List all heatmaps for a site |
| Generate | Create new heatmap analysis |
| Export | Export heatmap data for external analysis |
| Compare | Compare heatmap data across different time periods |

### 6. Data Subject

| Operation | Description |
|-----------|-------------|
| Request Deletion | Submit GDPR data deletion request |
| Get Request Status | Check status of data subject requests |
| Export Data | Export all data associated with a data subject |
| Anonymize | Anonymize user data while preserving analytics value |

## Usage Examples

```javascript
// Get all survey responses from the last 30 days
{
  "resource": "surveyResponse",
  "operation": "getAll",
  "surveyId": "12345",
  "filters": {
    "dateFrom": "2024-01-01",
    "dateTo": "2024-01-31",
    "limit": 100
  }
}
```

```javascript
// Create a new NPS survey
{
  "resource": "survey",
  "operation": "create",
  "siteId": "98765",
  "surveyData": {
    "name": "Customer Satisfaction Q1 2024",
    "type": "nps",
    "question": "How likely are you to recommend our product?",
    "targeting": {
      "pages": ["checkout", "thank-you"],
      "percentage": 25
    }
  }
}
```

```javascript
// Export heatmap data for homepage optimization
{
  "resource": "heatmap",
  "operation": "export",
  "siteId": "98765",
  "pageUrl": "https://example.com",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "format": "json"
}
```

```javascript
// Process GDPR deletion request
{
  "resource": "dataSubject",
  "operation": "requestDeletion",
  "userIdentifier": "user@example.com",
  "dataTypes": ["recordings", "surveys", "heatmaps"],
  "reason": "User requested account deletion"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key or expired token | Verify API key in credentials configuration |
| 403 Forbidden | Insufficient permissions for operation | Check account permissions and plan limits |
| 404 Not Found | Site, survey, or resource doesn't exist | Verify resource IDs and site configuration |
| 429 Rate Limited | Too many API requests | Implement delays between requests or reduce frequency |
| 500 Internal Error | Hotjar service unavailable | Retry operation after delay or check Hotjar status |
| Network Timeout | Connection timeout to Hotjar API | Check network connectivity and increase timeout |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-hotjar/issues)
- **Hotjar API Documentation**: [developers.hotjar.com](https://developers.hotjar.com)
- **Hotjar Community**: [help.hotjar.com](https://help.hotjar.com)