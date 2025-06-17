import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Kenya-specific Stripe configuration
export const stripeConfig = {
  currency: 'kes',
  locale: 'en-KE',
  country: 'KE',
  paymentMethods: ['card'],
  supportedCurrencies: ['kes'],
  minimumAmount: 100, // 1 KES minimum
};

// Create payment intent for KES
export const createPaymentIntent = async (amount, currency = 'kes', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        currency_display: 'KES',
        country: 'Kenya'
      },
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe payment intent creation failed: ${error.message}`);
  }
};

// Format amount for display in KES
export const formatKESAmount = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

export default stripe;