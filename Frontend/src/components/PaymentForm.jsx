import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/components/PaymentForm.css';

export default function PaymentForm({ orderId, amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        toast.success('Payment successful!');
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          await onSuccess(paymentIntent.id);
        }
        
        // Redirect to success page
        navigate(`/payment/success?orderId=${orderId}&paymentIntentId=${paymentIntent.id}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred.');
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-form-header">
        <h2 className="payment-form-title">Payment Details</h2>
        <p className="payment-form-amount">Amount: ${amount.toFixed(2)}</p>
      </div>

      <div className="payment-element-container">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="payment-error">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="payment-submit-btn"
      >
        {isProcessing ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <div className="payment-secure-notice">
        <svg className="lock-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
}
