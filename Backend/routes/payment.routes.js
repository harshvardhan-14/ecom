import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getPaymentStatus,
} from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create payment intent
router.post('/create-intent', authenticate, createPaymentIntent);

// Confirm payment
router.post('/confirm', authenticate, confirmPayment);

// Get payment status
router.get('/status/:paymentIntentId', authenticate, getPaymentStatus);

// Webhook endpoint (no authentication needed, verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
