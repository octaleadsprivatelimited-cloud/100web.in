# Automatic renewal reminders

The application creates eight reminder rounds whenever an administrator generates a Razorpay payment link. Every round attempts email, WhatsApp and SMS, and the remaining rounds are cancelled automatically when Razorpay confirms payment.

## Required environment settings

Add these values to `.env`:

```env
CRON_SECRET=use-a-long-random-secret

RESEND_API_KEY=
CRM_FROM_EMAIL=100 Web Technologies <billing@yourdomain.com>

META_WHATSAPP_TOKEN=
META_WHATSAPP_PHONE_NUMBER_ID=
META_WHATSAPP_PAYMENT_TEMPLATE=renewal_payment_reminder
META_WHATSAPP_TEMPLATE_LANGUAGE=en

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SMS_FROM=
```

The Meta template must be approved for business-initiated WhatsApp messages. Its body variables, in order, are customer name, renewal name, amount, due date and payment link.

## Scheduler

Call this endpoint every hour:

```text
POST https://your-domain.com/api/payment-reminders
Authorization: Bearer YOUR_CRON_SECRET
```

Use the scheduler supplied by the production host, or any cron service capable of sending an authenticated POST request. Failed rounds are retried after six hours. Paid renewals are never sent another reminder.
