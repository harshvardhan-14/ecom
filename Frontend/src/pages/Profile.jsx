import { useEffect, useState } from 'react';
import { User, MapPin, Plus, Trash2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { addressesAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import '../../src/styles/pages/Profile.css';

const Profile = () => {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await addressesAPI.getAll();
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to load addresses');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addressesAPI.create(newAddress);
      toast.success('Address added successfully');
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
      });
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await addressesAPI.delete(id);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="profile">
      <h1 className="profile__title">My Profile</h1>

      <div className="profile__grid">
        {/* User Info */}
        <div className="profile__card">
          <div className="profile__header">
            <div className="profile__avatar">
              <User className="profile__avatar-icon" />
            </div>
            <div className="profile__info">
              <h2 className="profile__name">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="profile__email">{user?.email}</p>
              <span className="profile__role">
                {user?.role}
              </span>
            </div>
          </div>
          
          <div className="profile__stats">
            <div className="profile__stat">
              <div className="profile__stat-value">12</div>
              <div className="profile__stat-label">Orders</div>
            </div>
            <div className="profile__stat">
              <div className="profile__stat-value">3</div>
              <div className="profile__stat-label">Wishlist</div>
            </div>
            <div className="profile__stat">
              <div className="profile__stat-value">5</div>
              <div className="profile__stat-label">Reviews</div>
            </div>
            <div className="profile__stat">
              <div className="profile__stat-value">2</div>
              <div className="profile__stat-label">Coupons</div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="profile__addresses">
          <div className="profile__addresses-header">
            <h2 className="profile__section-title">
              <MapPin className="profile__section-icon" />
              My Addresses
            </h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="profile__add-address"
              aria-label={showAddressForm ? 'Hide address form' : 'Add new address'}
            >
              <span className="profile__add-text">Add Address</span>
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="profile__form">
              <div className="profile__form-row">
                <div className="profile__form-group">
                  <label className="profile__form-label" htmlFor="full-name">Full Name</label>
                  <input
                    type="text"
                    id="full-name"
                    placeholder="Full Name"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="profile__form-input"
                    aria-required="true"
                  />
                </div>
                <div className="profile__form-group">
                  <label className="profile__form-label" htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="profile__form-input"
                    aria-required="true"
                  />
                </div>
              </div>
              
              <div className="profile__form-group">
                <label className="profile__form-label" htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  placeholder="Street Address"
                  required
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="profile__form-input"
                  aria-required="true"
                />
              </div>
              
              <div className="profile__form-row">
                <div className="profile__form-group">
                  <label className="profile__form-label" htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    placeholder="City"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="profile__form-input"
                    aria-required="true"
                  />
                </div>
                <div className="profile__form-group">
                  <label className="profile__form-label" htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    placeholder="State"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="profile__form-input"
                    aria-required="true"
                  />
                </div>
              </div>
              
              <div className="profile__form-row">
                <div className="profile__form-group">
                  <label className="profile__form-label" htmlFor="zip-code">ZIP Code</label>
                  <input
                    type="text"
                    id="zip-code"
                    placeholder="ZIP Code"
                    required
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="profile__form-input"
                    aria-required="true"
                  />
                </div>
                <div className="profile__form-group">
                  <label className="profile__form-label" htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    placeholder="Country"
                    required
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="profile__form-input"
                    aria-required="true"
                  />
                </div>
              </div>
              
              <div className="profile__form-group profile__form-group--checkbox">
                <label className="profile__form-label profile__form-label--checkbox">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="profile__form-checkbox"
                  />
                  <span>Set as default address</span>
                </label>
              </div>
              
              <div className="profile__form-actions">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="profile__button profile__button--secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="profile__button profile__button--primary"
                  aria-busy={loading}
                >
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          )}
          
          <div className="profile__address-list">
            {addresses.map((address) => (
              <div 
                key={address._id} 
                className={`profile__address-card ${address.isDefault ? 'profile__address-card--default' : ''}`}
                aria-label={address.isDefault ? 'Default address' : 'Address'}
              >
                <div className="profile__address-details">
                  <div className="profile__address-header">
                    <h3 className="profile__address-name">{address.fullName}</h3>
                    {address.isDefault && <span className="profile__default-badge">Default</span>}
                  </div>
                  <p className="profile__address-text">{address.street}</p>
                  <p className="profile__address-text">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="profile__address-text">{address.country}</p>
                  <p className="profile__address-phone">Phone: {address.phone}</p>
                </div>
                <div className="profile__address-actions">
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="profile__action-button"
                    aria-label={`Delete address for ${address.fullName}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            
            {addresses.length === 0 && !showAddressForm && (
              <div className="profile__empty-state">
                <MapPin className="profile__empty-icon" size={32} />
                <p className="profile__empty-text">No addresses saved yet</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="profile__button profile__button--primary"
                >
                  Add Your First Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
