# Stripe Payment Integration Setup

This document outlines the setup required to replace the Ziina payment system with Stripe.

## Environment Variables Required

Add these environment variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Stripe Dashboard Setup

1. **Create Stripe Account**: Sign up at https://stripe.com
2. **Get API Keys**: 
   - Go to Developers > API keys
   - Copy your publishable key and secret key
   - Use test keys for development

3. **Create Products and Prices**:
   - Go to Products in your Stripe dashboard
   - Create products for each service:
     - AI Job Apply: 200 AED
     - LinkedIn Optimization: 70 AED
     - ATS CV: 40 AED
     - Interview Training: 150 AED
   - Copy the price IDs and update them in `lib/payment-data.ts`

4. **Set up Webhook**:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook secret and add it to your environment variables

## Database Migration

Run the following command to update the payment method default:

```bash
npx prisma migrate dev --name update_payment_method_default
```

## Features Implemented

### ✅ Completed
- Stripe checkout session creation
- Webhook handling for payment events
- Service-specific payment processing
- AI Job Apply: +200 job count, +1 AI apply count
- Resume payment status updates
- Payment record creation
- LinkedIn email notification for AI Job Apply

### 🔄 Migration Steps
1. Update environment variables
2. Create Stripe products and prices
3. Set up webhook endpoint
4. Test payment flow
5. Remove old Ziina API routes (optional)

## API Routes

- `POST /api/stripe/create-checkout-session` - Creates Stripe checkout session
- `POST /api/webhooks/stripe` - Handles Stripe webhook events

## Payment Flow

1. User clicks "Get Service" on any service card
2. System creates Stripe checkout session
3. User is redirected to Stripe's hosted checkout page
4. After payment, user is redirected back to success URL
5. Stripe webhook processes the payment and updates database
6. User sees success modal with service details

## Testing

Use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits 