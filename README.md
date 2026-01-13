# n8n-nodes-hotjar

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Hotjar, the behavior analytics and user feedback platform. This node enables workflow automation for surveys, feedback, heatmaps, session recordings, funnels, events, GDPR compliance, and organization management through Hotjar's REST API.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **10 Resources** with 60+ operations for complete Hotjar integration
- **Survey Management**: Create, manage, publish surveys and export responses
- **Feedback Collection**: Access and manage feedback widget data
- **Session Recordings**: Search, filter, tag, and share session recordings
- **Heatmaps**: Create, manage, and retrieve click/scroll/move heatmap data
- **Funnels**: Create conversion funnels and analyze drop-off rates
- **Events**: Track and analyze custom events
- **Site Management**: Full site lifecycle management
- **GDPR Compliance**: User lookup, deletion, and privacy compliance tools
- **Organization Management**: Team members, roles, and API key management
- **Trigger Node**: Webhook-based triggers for real-time event handling
- **OAuth2 Authentication**: Secure client credentials flow
- **Cursor-based Pagination**: Efficient handling of large datasets
- **Rate Limiting**: Built-in support for Hotjar's API limits (3000 req/min)

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-hotjar`
5. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-hotjar
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-hotjar.git
cd n8n-nodes-hotjar

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-hotjar

# Restart n8n
n8n start
```

## Credentials Setup

This node uses OAuth2 client credentials flow for authentication.

### Getting API Credentials

1. Log in to your [Hotjar account](https://insights.hotjar.com)
2. Navigate to **Account Settings** > **API Keys**
3. Click **Create API Key**
4. Copy the **Client ID** and **Client Secret**

### Configuring in n8n

| Field | Description |
|-------|-------------|
| Client ID | Your Hotjar API Client ID |
| Client Secret | Your Hotjar API Client Secret |

## Resources & Operations

### Survey

| Operation | Description |
|-----------|-------------|
| List | List all surveys for a site |
| Get | Get survey details and configuration |
| Create | Create a new survey |
| Update | Update survey settings |
| Delete | Delete a survey |
| Publish | Publish survey to site |
| Unpublish | Remove survey from site |
| Duplicate | Clone an existing survey |
| Get Analytics | Get survey performance metrics |
| List Questions | Get all questions in a survey |

### Survey Response

| Operation | Description |
|-----------|-------------|
| List | List survey responses with pagination |
| Get | Get specific response details |
| Export | Export all responses for a survey |
| Delete | Delete a specific response |
| Get Trends | Get response trends over time |
| Bulk Export | Export responses for multiple surveys |
| Filter | Get responses matching criteria |

### Site

| Operation | Description |
|-----------|-------------|
| List | List all sites in organization |
| Get | Get site details |
| Create | Add a new site |
| Update | Update site settings |
| Delete | Remove a site |
| Get Settings | Get tracking configuration |
| Update Settings | Update tracking settings |
| Verify | Check site installation status |

### User (GDPR)

| Operation | Description |
|-----------|-------------|
| Lookup | Find user by identifier |
| Lookup by Email | Find user by email address |
| Lookup by User ID | Find user by custom user ID |
| Delete | Request user data deletion |
| Bulk Delete | Batch delete user data |
| Get Deletion Status | Check deletion request status |
| List Deletion Requests | Get all deletion requests |
| Cancel Deletion | Cancel a pending deletion request |

### Recording

| Operation | Description |
|-----------|-------------|
| List | List session recordings |
| Get | Get recording details |
| Delete | Delete a recording |
| Get Playback URL | Get recording playback URL |
| Get Events | Get events in a recording |
| Search | Search recordings by criteria |
| Add Tag | Tag a recording |
| Remove Tag | Remove tag from recording |
| Share | Generate shareable link |

### Heatmap

| Operation | Description |
|-----------|-------------|
| List | List all heatmaps |
| Get | Get heatmap details |
| Create | Create new heatmap |
| Update | Update heatmap settings |
| Delete | Delete a heatmap |
| Get Data | Get click/scroll/move data |
| Get Screenshot | Get page screenshot |
| Refresh | Regenerate heatmap data |

### Feedback

| Operation | Description |
|-----------|-------------|
| List | List incoming feedback |
| Get | Get feedback details |
| Delete | Delete feedback item |
| Export | Export feedback data |
| Get Trends | Get feedback trends over time |
| Get Widget Config | Get widget configuration |
| Update Widget | Update widget settings |

### Funnel

| Operation | Description |
|-----------|-------------|
| List | List all funnels |
| Get | Get funnel details |
| Create | Create conversion funnel |
| Update | Update funnel steps |
| Delete | Delete a funnel |
| Get Analytics | Get funnel conversion data |
| Get Recordings | Get recordings for a funnel step |

### Event

| Operation | Description |
|-----------|-------------|
| List | List tracked events |
| Get | Get event details |
| Get Analytics | Get event occurrence data |
| Search Recordings | Find recordings containing an event |

### Organization

| Operation | Description |
|-----------|-------------|
| Get | Get organization details |
| List Members | List team members |
| Invite Member | Invite new team member |
| Update Member Role | Change member permissions |
| Remove Member | Remove team member |
| List API Keys | List all API keys |
| Create API Key | Generate new API key |
| Revoke API Key | Revoke an API key |

## Trigger Node: Hotjar Trigger

Webhook-based trigger for real-time Hotjar events.

| Event | Description |
|-------|-------------|
| survey.response.created | New survey response received |
| feedback.received | New feedback submitted |
| recording.completed | Recording session ended |
| user.deletion.completed | User deletion finished |
| heatmap.data.ready | Heatmap data generated |

**Note**: Configure the webhook URL in your Hotjar dashboard. Some events may require an Enterprise plan.

## Usage Examples

### Export Survey Responses

```javascript
// Export all survey responses for a specific survey
{
  "resource": "response",
  "operation": "export",
  "siteId": "123456",
  "surveyId": "789",
  "returnAll": true,
  "filters": {
    "dateFrom": "2024-01-01T00:00:00Z",
    "dateTo": "2024-01-31T23:59:59Z"
  }
}
```

### Create a Survey

```javascript
// Create a new survey with questions
{
  "resource": "survey",
  "operation": "create",
  "siteId": "123456",
  "name": "Customer Satisfaction Survey",
  "questions": "[{\"type\": \"rating\", \"text\": \"How satisfied are you?\"}]"
}
```

### GDPR User Lookup and Delete

```javascript
// Look up a user by email
{
  "resource": "user",
  "operation": "lookupByEmail",
  "siteId": "123456",
  "email": "user@example.com"
}

// Request user deletion
{
  "resource": "user",
  "operation": "delete",
  "siteId": "123456",
  "userId": "user_abc123",
  "confirm": true
}
```

### Search and Tag Recordings

```javascript
// Search recordings by device and date
{
  "resource": "recording",
  "operation": "search",
  "siteId": "123456",
  "returnAll": false,
  "limit": 50,
  "filters": {
    "device": "mobile",
    "dateFrom": "2024-01-01T00:00:00Z",
    "minDuration": 30
  }
}

// Add a tag to a recording
{
  "resource": "recording",
  "operation": "addTag",
  "siteId": "123456",
  "recordingId": "rec_xyz789",
  "tag": "high-value-user"
}
```

### Create a Conversion Funnel

```javascript
// Create a checkout funnel
{
  "resource": "funnel",
  "operation": "create",
  "siteId": "123456",
  "name": "Checkout Funnel",
  "steps": "[{\"name\": \"Cart\", \"url_pattern\": \"/cart\"}, {\"name\": \"Checkout\", \"url_pattern\": \"/checkout\"}, {\"name\": \"Thank You\", \"url_pattern\": \"/thank-you\"}]"
}
```

## Hotjar Concepts

### Sites
A site in Hotjar represents a website or web application you're tracking. Each site has a unique ID and tracking code.

### Surveys
Surveys (also known as polls or feedback widgets) allow you to collect direct feedback from users. Types include:
- **Poll**: Quick single-question feedback
- **Survey**: Multi-question surveys
- **Feedback**: Open-ended feedback widgets

### Session Recordings
Session recordings capture user interactions including mouse movements, clicks, scrolls, and form interactions. Recordings can be filtered by device type, browser, country, duration, and URL patterns.

### Heatmaps
Heatmaps visualize user behavior on pages:
- **Click maps**: Show where users click
- **Move maps**: Show mouse movement patterns
- **Scroll maps**: Show how far users scroll

### Funnels
Funnels track user journeys through defined steps, helping identify where users drop off in conversion processes.

### Events
Custom events tracked via Hotjar's JavaScript API, useful for tracking specific user actions and correlating with recordings.

## API Rate Limits

Hotjar API allows:
- **3000 requests per minute** (50 requests per second)
- The node automatically handles rate limit responses (HTTP 429)

## Error Handling

The node handles common API errors:

| Error Code | Description |
|------------|-------------|
| 400 | Bad request - check your parameters |
| 401 | Unauthorized - verify credentials |
| 403 | Forbidden - insufficient permissions |
| 404 | Not found - resource doesn't exist |
| 429 | Rate limited - wait before retrying |
| 500 | Server error - retry later |

## Security Best Practices

1. **Store credentials securely**: Use n8n's credential management
2. **Minimal permissions**: Only request necessary API scopes
3. **GDPR compliance**: Use the User resource for privacy requests
4. **Audit logging**: Log access to user data

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format code
npm run format
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Documentation**: [Hotjar API Docs](https://developer.hotjar.com/docs)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-hotjar/issues)
- **Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [Hotjar](https://www.hotjar.com) for their behavior analytics platform
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for their support and feedback
