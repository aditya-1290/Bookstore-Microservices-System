# Gmail SMTP Alternatives for Notification Service

## Current Setup Analysis
- **Current SMTP**: Gmail (smtp.gmail.com:587)
- **Issue**: Cannot use personal email services, only office Zimbra email available

## Recommended Alternatives

### 1. Zimbra SMTP (Primary Recommendation)
Since you have access to company Zimbra email, use your company's SMTP server:

**Configuration:**
```
SMTP_SERVER=mail.yourcompany.com
SMTP_PORT=587 (or 465 for SSL)
SMTP_USERNAME=your.office.email@company.com
SMTP_PASSWORD=your-office-password
FROM_EMAIL=your.office.email@company.com
FROM_NAME=Book Store Notifications
```

**Steps:**
1. Contact IT department for exact SMTP server details
2. Ask for: server address, port, authentication method
3. Verify if TLS/SSL is required

### 2. Transactional Email Services (No Personal Email Needed)

#### SendGrid (Free Tier - 100 emails/day)
- **Signup**: Use any email address (can be temporary)
- **Configuration**:
```
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### Mailgun (Free Tier - 5,000 emails/month)
- **Configuration**:
```
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

#### Amazon SES
- **Configuration**:
```
SMTP_SERVER=email-smtp.[region].amazonaws.com
SMTP_PORT=587
SMTP_USERNAME=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

### 3. Testing Solutions

#### Mailtrap (Free for Testing)
- **Configuration**:
```
SMTP_SERVER=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
```

#### Ethereal Email (Free Test Emails)
- **Configuration**: Auto-generated on signup

## Quick Setup Instructions

### Option 1: SendGrid (Fastest Setup)
1. Visit sendgrid.com
2. Create free account (use any email)
3. Go to Settings > API Keys
4. Create API key with full access
5. Update notification service configuration

### Option 2: Zimbra SMTP
1. Check with IT for SMTP settings
2. Common Zimbra settings:
   - Server: mail.yourcompany.com
   - Port: 587 (STARTTLS) or 465 (SSL)
   - Authentication: Yes

## Alternative Notification Methods

If SMTP is completely blocked, consider:
- **Webhook notifications** to Slack/Discord/Teams
- **Push notifications** via Firebase
- **SMS** via Twilio
- **In-app notifications** stored in database

## Configuration Update Script

Create a new `.env` file with your chosen alternative:

```bash
# For SendGrid
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-actual-api-key
FROM_EMAIL=noreply@yourapp.com
FROM_NAME=Book Store

# For Zimbra
SMTP_SERVER=mail.yourcompany.com
SMTP_PORT=587
SMTP_USERNAME=you@company.com
SMTP_PASSWORD=your-password
FROM_EMAIL=you@company.com
FROM_NAME=Book Store Notifications
