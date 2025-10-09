import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { ordersAPI } from '../lib/api';
import { formatPrice, formatDate, getStatusColor } from '../lib/utils';
import { getDefaultProductImage } from '../assets/assets';
import toast from 'react-hot-toast';
import '../styles/pages/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersAPI.getAll();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders-container">
        <Package className="empty-orders-icon" />
        <h2 className="empty-orders-text">No orders yet</h2>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="order-card"
          >
            <div className="order-header">
              <div>
                <p className="order-id">Order #{order.id.slice(0, 8)}</p>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div className="order-header-right">
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <ChevronRight className="order-chevron-icon" />
              </div>
            </div>

            <div className="order-items-preview">
              <div className="order-items-images">
                {order.orderItems.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={item.product.images[0] || getDefaultProductImage(item.product.category?.name)}
                    alt={item.product.name}
                    className="order-item-image"
                  />
                ))}
                {order.orderItems.length > 3 && (
                  <div className="order-items-more">
                    +{order.orderItems.length - 3}
                  </div>
                )}
              </div>
              <div className="order-items-count-container">
                <p className="order-items-count">
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="order-total-container">
                <p className="order-total-label">Total</p>
                <p className="order-total-amount">{formatPrice(order.total)}</p>
              </div>
            </div>

            <div className="order-footer">
              <span className={`order-payment-status ${getStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
              <span className="order-payment-method">{order.paymentMethod.toUpperCase()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );}