# CRM communication integrations

The CRM core works locally with PostgreSQL. Add provider credentials to `.env` to enable real delivery.

## WhatsApp — Meta Cloud API

```env
META_WHATSAPP_TOKEN=
META_WHATSAPP_PHONE_NUMBER_ID=
META_GRAPH_VERSION=v23.0
```

WhatsApp marketing outside an active customer-service conversation requires approved message templates in Meta Business Manager.

## IVR and outbound calling — Twilio

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_TWIML_URL=https://your-public-domain.com/your-twiml-handler
```

The TwiML URL controls the IVR prompts and call flow.

## Email marketing — Resend

```env
RESEND_API_KEY=
CRM_FROM_EMAIL=100 Web Technologies <crm@your-verified-domain.com>
```

Verify the sender domain in Resend before sending to real contacts.

Restart the application after changing environment variables. Use test accounts and recipient consent before enabling bulk campaigns.
