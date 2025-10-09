import { useEffect, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { ordersAPI } from '../../lib/api';
import { formatPrice, formatDate, getStatusColor } from '../../lib/utils';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/pages/AdminOrders.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

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

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="search-filter-bar">
        <div className="relative" style={{ flex: 1 }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h2 className="data-table-title">All Orders ({filteredOrders.length})</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-mono text-sm">#{order.id.slice(0, 8)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                  </td>
                  <td className="py-3 px-4 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4 font-semibold">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm border-0 cursor-pointer ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdatePayment(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm border-0 cursor-pointer ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="FAILED">Failed</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        // View order details
                        window.open(`/orders/${order.id}`, '_blank');
                      }}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <ShoppingBag className="empty-state-icon" />
              <div className="empty-state-title">No orders found</div>
              <div className="empty-state-description">Orders will appear here once customers place them</div>
            </div>
          )}
      </div>
    </AdminLayout>
  );
}