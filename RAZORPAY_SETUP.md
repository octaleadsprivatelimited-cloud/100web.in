# Razorpay payment setup

1. In the Razorpay Dashboard, create Test Mode API keys.
2. Add these values to `.env` and restart the website:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=choose_a_separate_webhook_secret
PUBLIC_APP_URL=https://your-public-domain.com
```

3. In Razorpay Dashboard → Webhooks, add:

```text
https://your-public-domain.com/api/razorpay-webhook
```

4. Use the same value from `RAZORPAY_WEBHOOK_SECRET` as the webhook secret.
5. Enable `payment_link.paid`, `payment.captured`, `payment.authorized`, and `payment.failed`.

Razorpay cannot deliver production webhooks to a localhost URL. Use a deployed HTTPS domain for live payments. Test mode should be completed before switching to live API keys.
