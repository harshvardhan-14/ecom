import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, ExternalLink, ArrowUpDown, ChevronDown } from 'lucide-react';
import { ordersAPI } from '../../lib/api';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/pages/AdminOrders.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in AdminOrders:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h3>Something went wrong</h3>
            <p>{this.state.error?.message || 'An error occurred while loading orders.'}</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await ordersAPI.getAllAdmin(params);
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdatePayment = async (orderId, newPaymentStatus) => {
    try {
      await ordersAPI.updatePayment(orderId, newPaymentStatus);
      toast.success('Payment status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${order.user.firstName} ${order.user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  // Function to render the orders table (desktop view)
  const renderOrdersTable = () => (
    <div className="hidden md:block">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                Order ID
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                Date
                <ChevronDown className="ml-1 h-3 w-3" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                #{order.id.slice(0, 8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {order.user?.firstName} {order.user?.lastName}
                </div>
                <div className="text-sm text-gray-500">{order.user?.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatPrice(order.total)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className={`status-select ${order.status.toLowerCase()}`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.paymentStatus}
                  onChange={(e) => handleUpdatePayment(order.id, e.target.value)}
                  className={`status-select ${order.paymentStatus.toLowerCase()}`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => window.open(`/orders/${order.id}`, '_blank')}
                  className="action-btn view-btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Function to render order cards (mobile view)
  const renderOrderCards = () => (
    <div className="md:hidden space-y-4">
      {filteredOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-card-header">
            <div>
              <div className="text-sm font-medium text-blue-600">#{order.id.slice(0, 8)}</div>
              <div className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{formatPrice(order.total)}</div>
              <div className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status.toLowerCase()}
              </div>
            </div>
          </div>
          <div className="order-card-details">
            <div className="order-card-row">
              <span className="order-card-label">Customer</span>
              <span className="order-card-value">
                {order.user?.firstName} {order.user?.lastName}
              </span>
            </div>
            <div className="order-card-row">
              <span className="order-card-label">Payment</span>
              <span className="order-card-value">
                <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                  {order.paymentStatus.toLowerCase()}
                </span>
              </span>
            </div>
          </div>
          <div className="order-card-actions">
            <select
              value={order.status}
              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
              className="status-select flex-1 text-sm"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              onClick={() => window.open(`/orders/${order.id}`, '_blank')}
              className="action-btn view-btn"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ErrorBoundary>
      <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">Manage and track all customer orders</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all orders including their details and current status.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 bg-white py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredOrders.length > 0 ? (
                <>
                  {renderOrdersTable()}
                  {renderOrderCards()}
                </>
              ) : (
                <div className="empty-state">
                  <ShoppingBag className="empty-state-icon" />
                  <div className="empty-state-title">No orders found</div>
                  <p className="empty-state-description">
                    {search || statusFilter
                      ? 'Try adjusting your search or filter to find what you\'re looking for.'
                      : 'Orders will appear here once customers place them.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </AdminLayout>
    </ErrorBoundary>
  );
}