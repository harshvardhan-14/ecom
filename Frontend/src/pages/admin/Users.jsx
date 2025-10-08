import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, Shield, User } from 'lucide-react';
import { adminAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
//import '../../styles/pages/Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = roleFilter ? { role: roleFilter } : {};
      const { data } = await adminAPI.getAllUsers(params);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
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
        <h1 className="admin-page-title">Users</h1>
        <p className="admin-page-subtitle">Manage user accounts and roles</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-label">Total Users</div>
              <div className="stat-card-value">{users.length}</div>
            </div>
            <div className="stat-card-icon blue">
              <UsersIcon size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-label">Customers</div>
              <div className="stat-card-value">
                {users.filter(u => u.role === 'CUSTOMER').length}
              </div>
            </div>
            <div className="stat-card-icon green">
              <User size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-label">Admins</div>
              <div className="stat-card-value">
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
            </div>
            <div className="stat-card-icon purple">
              <Shield size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="search-filter-bar">
        <div className="relative" style={{ flex: 1 }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="data-table-container">
        <div className="data-table-header">
          <h2 className="data-table-title">All Users ({filteredUsers.length})</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div>
                    <p style={{ fontWeight: 600 }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
                      ID: {user.id.slice(0, 8)}
                    </p>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.role === 'ADMIN' ? 'delivered' : 'processing'}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.875rem' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="filter-select"
                    style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <UsersIcon className="empty-state-icon" />
            <div className="empty-state-title">No users found</div>
            <div className="empty-state-description">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
