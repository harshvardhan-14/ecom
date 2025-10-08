import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { ordersAPI } from '../lib/api';
import { formatPrice, formatDate, getStatusColor } from '../lib/utils';
//import { getDefaultProductImage } from '../assets/assets';
import toast from 'react-hot-toast';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="card p-6 hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex -space-x-2">
                {order.orderItems.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={item.product.images[0] || getDefaultProductImage(item.product.category?.name)}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                  />
                ))}
                {order.orderItems.length > 3 && (
                  <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center text-sm font-medium">
                    +{order.orderItems.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-primary-600">{formatPrice(order.total)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
              <span className="text-gray-600">{order.paymentMethod.toUpperCase()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
