import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Plus } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { addressesAPI, ordersAPI } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { assets } from '../assets/assets';
import '../../src/styles/pages/Checkout.css';
import toast from 'react-hot-toast';

// Helper function to get product image
const getProductImage = (images) => {
  if (!images || images.length === 0) return assets.product_img1;
  
  const imagePath = Array.isArray(images) ? images[0] : images;
  // Convert database path to imported image
  const imageMap = {
    '/product_img1.png': assets.product_img1,
    '/product_img2.png': assets.product_img2,
    '/product_img3.png': assets.product_img3,
    '/product_img4.png': assets.product_img4,
    '/product_img5.png': assets.product_img5,
    '/product_img6.png': assets.product_img6,
    '/product_img7.png': assets.product_img7,
    '/product_img8.png': assets.product_img8,
    '/product_img9.png': assets.product_img9,
    '/product_img10.png': assets.product_img10,
    '/product_img11.png': assets.product_img11,
    '/product_img12.png': assets.product_img12,
  };
  
  return imageMap[imagePath] || assets.product_img1;
};


export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await addressesAPI.getAll();
      setAddresses(data);
      const defaultAddr = data.find((addr) => addr.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    } catch (error) {
      toast.error('Failed to load addresses');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
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
      });
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const { data } = await ordersAPI.create({
        shippingAddressId: selectedAddress,
        paymentMethod,
      });
      
      // Redirect to payment page with order details
      navigate(`/payment?orderId=${data.id}&amount=${finalTotal}`);
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to place order';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const shippingCost = total > 50 ? 0 : 10;
  const finalTotal = total + shippingCost;

  return (
    <div className="checkout">
      <h1 className="checkout__title">Checkout</h1>

      <div className="checkout__container">
        <div className="checkout-form">
          {/* Shipping Address */}
          <section className="checkout-section">
            <header className="checkout-section__header">
              <h2 className="checkout-section__title">
                <MapPin className="checkout-section__icon" size={20} />
                Shipping Address
              </h2>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="btn btn--outline btn--add-address"
              >
                <Plus size={16} className="btn__icon" />
                Add New
              </button>
            </header>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="address-form">
                <div className="address-form__grid">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="input"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="input input--full"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="State/Province"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="ZIP/Postal Code"
                    required
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    required
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="address-form__actions">
                  <button 
                    type="button" 
                    className="btn btn--text"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="address-list">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`address-option ${
                    selectedAddress === address.id ? 'address-option--selected' : ''
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="address-option__radio"
                    aria-label={`Select address for ${address.fullName}`}
                  />
                  <div className="address-option__content">
                    <div className="address-option__name">
                      {address.fullName}
                      {address.isDefault && (
                        <span className="address-option__default">Default</span>
                      )}
                    </div>
                    <div className="address-option__details">
                      <div>{address.street}</div>
                      <div>{address.city}, {address.state} {address.zipCode}</div>
                      <div>{address.country}</div>
                      <div>Phone: {address.phone}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">
              <CreditCard className="checkout-section__icon" size={20} />
              Payment Method
            </h2>
            <div className="payment-methods">
              <label className={`payment-method ${
                paymentMethod === 'card' ? 'payment-method--selected' : ''
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="payment-method__radio"
                />
                <CreditCard className="payment-method__icon" size={20} />
                <span className="payment-method__label">Credit/Debit Card (Stripe)</span>
                <span className="sr-only">Pay with Stripe - Credit or Debit Card</span>
              </label>
              
              <label className={`payment-method ${
                paymentMethod === 'paypal' ? 'payment-method--selected' : ''
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="payment-method__radio"
                />
                <CreditCard className="payment-method__icon" size={20} />
                <span className="payment-method__label">PayPal</span>
                <span className="sr-only">Pay with your PayPal account</span>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <aside className="order-summary">
          <h2 className="order-summary__title">Order Summary</h2>
          
          <div className="order-summary__items">
            {items.map((item) => (
              <div key={item.id} className="order-summary-item">
                <img
                  src={getProductImage(item.product.images)}
                  alt={item.product.name}
                  className="order-summary-item__image"
                />
                <div className="order-summary-item__details">
                  <div className="order-summary-item__name">
                    {item.product.name}
                  </div>
                  <div className="order-summary-item__meta">
                    <span>Qty: {item.quantity}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-summary__totals">
            <div className="order-summary__row">
              <span className="order-summary__label">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
            </div>
            <div className="order-summary__total">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
          
          <div className="order-summary__actions">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading || items.length === 0}
              className={`btn btn--primary btn--block ${
                loading || items.length === 0 ? 'btn--disabled' : ''
              }`}
              aria-label={items.length === 0 ? 'Your cart is empty' : 'Place your order'}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}