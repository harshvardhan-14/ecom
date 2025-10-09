import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { ordersAPI, productsAPI } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/pages/AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        ordersAPI.getAllAdmin({ limit: 5 }),
        productsAPI.getAll({ limit: 1 }),
      ]);

      const orders = ordersRes.data.orders;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter((order) => order.status === 'PENDING').length;

      setStats({
        totalOrders: ordersRes.data.pagination.total,
        totalRevenue,
        totalProducts: productsRes.data.pagination.total,
        pendingOrders,
      });

      setRecentOrders(orders);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-label">Total Orders</div>
              <div className="stat-card-value">{stats.totalOrders}</div>
              <div className="stat-card-change positive">
                <ArrowUp size={16} />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="stat-card-icon blue">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-label">Total Revenue</div>
              <div className="stat-card-value">{formatPrice(stats.totalRevenue)}</div>
              <div className="stat-card-change positive">
                <ArrowUp size={16} />
                <span>+20.1% from last month</span>
              </div>
            </div>
            <div className="stat-card-icon green">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-label">Total Products</div>
              <div className="stat-card-value">{stats.totalProducts}</div>
              <div className="stat-card-change positive">
                <ArrowUp size={16} />
                <span>+5 new products</span>
              </div>
            </div>
            <div className="stat-card-icon purple">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-label">Pending Orders</div>
              <div className="stat-card-value">{stats.pendingOrders}</div>
              <div className="stat-card-change negative">
                <ArrowDown size={16} />
                <span>Needs attention</span>
              </div>
            </div>
            <div className="stat-card-icon orange">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/products" className="action-card">
          <Package className="action-card-icon" />
          <h3 className="action-card-title">Manage Products</h3>
          <p className="action-card-description">Add, edit, or remove products from your inventory</p>
        </Link>

        <Link to="/admin/orders" className="action-card">
          <ShoppingBag className="action-card-icon" />
          <h3 className="action-card-title">Manage Orders</h3>
          <p className="action-card-description">View and update order status and details</p>
        </Link>

        <div className="action-card" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          <Users className="action-card-icon" />
          <h3 className="action-card-title">Manage Users</h3>
          <p className="action-card-description">Coming soon - User management features</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h2 className="data-table-title">Recent Orders</h2>
          <Link to="/admin/orders" className="admin-btn admin-btn-secondary admin-btn-sm">
            View All Orders
          </Link>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.user.firstName} {order.user.lastName}</td>
                  <td><strong>{formatPrice(order.total)}</strong></td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="empty-state">
                    <ShoppingBag className="empty-state-icon" />
                    <div className="empty-state-title">No orders yet</div>
                    <div className="empty-state-description">Orders will appear here once customers start purchasing</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
