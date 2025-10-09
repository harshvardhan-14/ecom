import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/pages/Payment.css';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = searchParams.get('orderId');
  const amount = parseFloat(searchParams.get('amount') || '0');

  useEffect(() => {
    if (!orderId || !amount) {
      toast.error('Invalid payment request');
      navigate('/checkout');
      return;
    }

    createPaymentIntent();
  }, [orderId, amount]);

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/payment/create-intent',
        {
          amount,
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClientSecret(response.data.clientSecret);
      setLoading(false);
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment. Please try again.');
      toast.error('Failed to initialize payment');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        'http://localhost:5000/api/payment/confirm',
        {
          paymentIntentId,
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Error confirming payment:', err);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <div className="loading-spinner"></div>
          <p>Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-error-container">
          <h2>Payment Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary">
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3498db',
      },
    },
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <p>Order ID: {orderId?.slice(0, 8)}</p>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm
              orderId={orderId}
              amount={amount}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
