import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import '../styles/pages/PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentIntentId = searchParams.get('paymentIntentId');

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        <div className="success-icon">
          <CheckCircle size={80} />
        </div>

        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="order-details">
          <div className="detail-item">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">{orderId?.slice(0, 8)}</span>
          </div>
          {paymentIntentId && (
            <div className="detail-item">
              <span className="detail-label">Payment ID:</span>
              <span className="detail-value">{paymentIntentId.slice(0, 16)}...</span>
            </div>
          )}
        </div>

        <div className="success-info">
          <p>✅ Payment processed successfully</p>
          <p>✅ Order confirmation email sent</p>
          <p>✅ You can track your order in the Orders section</p>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
