import Order from '../models/Order.js';
import { createPaymentIntent, formatKESAmount } from '../config/stripe.js';
import stripe from '../config/stripe.js';
import asyncHandler from 'express-async-handler';
import logger from '../config/logger.js';

// @desc    Create payment intent (Private)
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntentController = asyncHandler(async (req, res) => {
  const { amount, orderId, currency = 'kes' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid amount is required'
    });
  }

  // Validate order if provided
  let order = null;
  if (orderId) {
    order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }
  }

  try {
    const paymentIntent = await createPaymentIntent(
      amount,
      currency,
      {
        userId: req.user.id,
        userEmail: req.user.email,
        orderId: orderId || '',
        country: 'Kenya',
        currency_display: 'KES'
      }
    );

    logger.info(`Payment intent created: ${paymentIntent.id} for ${formatKESAmount(amount)} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        formattedAmount: formatKESAmount(amount)
      }
    });
  } catch (error) {
    logger.error('Payment intent creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment setup failed',
      error: error.message
    });
  }
});

// @desc    Confirm payment (Private)
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({
      success: false,
      message: 'Payment intent ID is required'
    });
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: paymentIntent.status
      });
    }

    // Update order if provided
    if (orderId) {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: paymentIntentId,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: req.user.email
        };
        order.updateStatus('confirmed', 'Payment confirmed via Stripe');
        await order.save();

        logger.info(`Payment confirmed for order ${order.orderNumber}: ${paymentIntentId}`);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentIntentId,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        formattedAmount: formatKESAmount(paymentIntent.amount / 100)
      }
    });
  } catch (error) {
    logger.error('Payment confirmation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment confirmation failed',
      error: error.message
    });
  }
});

// @desc    Get payment methods (Public)
// @route   GET /api/payments/methods
// @access  Public
export const getPaymentMethods = asyncHandler(async (req, res) => {
  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      currency: 'KES',
      fees: 'Standard processing fees apply',
      processingTime: 'Instant',
      icon: 'credit-card',
      available: true,
      supportedCards: ['visa', 'mastercard', 'amex']
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Pay with M-Pesa mobile money',
      currency: 'KES',
      fees: 'M-Pesa transaction fees apply',
      processingTime: 'Instant',
      icon: 'mobile',
      available: process.env.MPESA_ENABLED === 'true',
      note: 'Available for Kenyan phone numbers only'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      currency: 'KES',
      fees: 'Bank transfer fees may apply',
      processingTime: '1-3 business days',
      icon: 'bank',
      available: true,
      note: 'Orders processed after payment verification'
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      currency: 'KES',
      fees: 'Additional delivery fee may apply',
      processingTime: 'Upon delivery',
      icon: 'truck',
      available: true,
      note: 'Available within Nairobi and selected counties'
    }
  ];

  res.status(200).json({
    success: true,
    data: paymentMethods.filter(method => method.available)
  });
});

// @desc    Handle Stripe webhook (Public)
// @route   POST /api/payments/webhook
// @access  Public
export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      logger.info(`Payment succeeded: ${paymentIntent.id}`);
      
      // Update order status if orderId is in metadata
      if (paymentIntent.metadata.orderId) {
        try {
          const order = await Order.findById(paymentIntent.metadata.orderId);
          if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.metadata.userEmail
            };
            order.updateStatus('confirmed', 'Payment confirmed via webhook');
            await order.save();
            logger.info(`Order updated via webhook: ${order.orderNumber}`);
          }
        } catch (error) {
          logger.error(`Error updating order via webhook: ${error.message}`);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      logger.warn(`Payment failed: ${failedPayment.id}`);
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// @desc    Calculate shipping cost (Public)
// @route   POST /api/payments/calculate-shipping
// @access  Public
export const calculateShipping = asyncHandler(async (req, res) => {
  const { county, city, items, totalWeight } = req.body;

  // Kenya counties with shipping rates (in KES)
  const shippingRates = {
    // Nairobi and surrounding
    'Nairobi': { standard: 200, express: 500 },
    'Kiambu': { standard: 300, express: 600 },
    'Machakos': { standard: 350, express: 700 },
    'Kajiado': { standard: 400, express: 800 },
    
    // Central Kenya
    'Murang\'a': { standard: 400, express: 800 },
    'Nyeri': { standard: 450, express: 900 },
    'Kirinyaga': { standard: 450, express: 900 },
    'Nyandarua': { standard: 500, express: 1000 },
    
    // Coast
    'Mombasa': { standard: 600, express: 1200 },
    'Kilifi': { standard: 700, express: 1400 },
    'Kwale': { standard: 750, express: 1500 },
    
    // Western Kenya
    'Kisumu': { standard: 500, express: 1000 },
    'Kakamega': { standard: 550, express: 1100 },
    'Bungoma': { standard: 600, express: 1200 },
    
    // Default for other counties
    'default': { standard: 600, express: 1200 }
  };

  const rates = shippingRates[county] || shippingRates['default'];
  
  // Add weight-based pricing for heavy items
  const baseWeight = 5; // kg
  const weightSurcharge = totalWeight > baseWeight ? (totalWeight - baseWeight) * 50 : 0;

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '3-5 business days',
      cost: rates.standard + weightSurcharge,
      formattedCost: formatKESAmount(rates.standard + weightSurcharge),
      estimatedDays: '3-5'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '1-2 business days',
      cost: rates.express + weightSurcharge,
      formattedCost: formatKESAmount(rates.express + weightSurcharge),
      estimatedDays: '1-2'
    }
  ];

  // Free shipping for orders above KES 10,000
  const orderTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  if (orderTotal >= 10000) {
    shippingOptions.forEach(option => {
      option.cost = 0;
      option.formattedCost = 'Free';
      option.note = 'Free shipping on orders over KES 10,000';
    });
  }

  res.status(200).json({
    success: true,
    data: {
      county,
      city,
      shippingOptions,
      freeShippingThreshold: 10000,
      formattedFreeShippingThreshold: formatKESAmount(10000)
    }
  });
});

// @desc    Get payment history (Private)
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const payments = await Order.find({
    user: req.user.id,
    isPaid: true
  })
    .select('orderNumber totalPrice paidAt paymentMethod paymentResult status')
    .sort({ paidAt: -1 })
    .limit(limit)
    .skip(startIndex);

  const total = await Order.countDocuments({
    user: req.user.id,
    isPaid: true
  });

  res.status(200).json({
    success: true,
    count: payments.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPayments: total
    },
    data: payments
  });
});