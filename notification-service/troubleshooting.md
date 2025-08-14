# SendGrid Connection Troubleshooting Guide

## Error Analysis
**Error**: Connection unexpectedly closed: [WinError 10060]
**Cause**: Network/firewall blocking SMTP connection to smtp.sendgrid.net

## Immediate Solutions

### 1. **Check Network/Firewall Settings**
```bash
# Test basic connectivity
telnet smtp.sendgrid.net 587

# Test with different port
telnet smtp.sendgrid.net 465
```

### 2. **Alternative SendGrid Ports**
```python
# Update configuration to try different ports
SMTP_PORT = 465  # SSL instead of STARTTLS
# OR
SMTP_PORT = 2525  # Alternative port
```

### 3. **Use SendGrid Web API (Recommended)**
Instead of SMTP, use SendGrid's HTTP API which bypasses SMTP restrictions:

```python
import requests

def send_email_sendgrid_api(to_email, subject, body, html_body=None):
    """Send email using SendGrid Web API"""
    api_key = os.getenv("SENDGRID_API_KEY")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "personalizations": [{
            "to": [{"email": to_email}],
            "subject": subject
        }],
        "from": {
            "email": FROM_EMAIL,
            "name": FROM_NAME
        },
        "content": [
            {
                "type": "text/plain",
                "value": body
            }
        ]
    }
    
    if html_body:
        data["content"].append({
            "type": "text/html",
            "value": html_body
        })
    
    response = requests.post(
        "https://api.sendgrid.com/v3/mail/send",
        headers=headers,
        json=data
    )
    
    return response.status_code == 202
```

### 4. **Use Mailtrap for Testing (Immediate Fix)**
If SendGrid is blocked, use Mailtrap for immediate testing:

```bash
# Update .env temporarily
SMTP_SERVER=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
```

### 5. **Check Corporate Proxy Settings**
If behind corporate firewall:
```python
# Add proxy support
import os
os.environ['HTTP_PROXY'] = 'http://proxy.company.com:8080'
os.environ['HTTPS_PROXY'] = 'http://proxy.company.com:8080'
```

## Quick Fix Steps

1. **Test with Mailtrap first** (guaranteed to work)
2. **Try SendGrid port 465** instead of 587
3. **Use SendGrid Web API** (bypasses SMTP entirely)
4. **Check with IT department** for SMTP whitelist

## Updated Configuration Options

### Option A: SendGrid Web API (Most Reliable)
```python
# Replace send_email function with API version
def send_email(to_email, subject, body, html_body=None):
    return send_email_sendgrid_api(to_email, subject, body, html_body)
```

### Option B: Different SMTP Settings
```python
# Try these combinations:
# 1. Port 465 with SSL
# 2. Port 2525 (alternative)
# 3. Port 25 (if unblocked)
```

### Option C: Mailtrap for Immediate Testing
```python
# Use Mailtrap credentials for immediate testing
```

Choose the solution that works best for your network environment.
