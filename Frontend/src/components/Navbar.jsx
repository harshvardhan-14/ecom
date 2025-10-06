import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Search, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { assets } from '../assets/assets';
import '../styles/components/Navbar.css';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const { items, fetchCart } = useCartStore();

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // for default dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Fetch cart items when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {});
    }
  }, [isAuthenticated, fetchCart]);


  const handleLogout = () => {
    logout();
    navigate('/');
  };
   
  // Handle search input submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-flex">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" className="navbar-logo-link">
              <img
                src={assets.gs_logo}
                alt="ShopHub Logo"
                className="navbar-logo-img"
              />
              <span className="navbar-logo-text">ShopHub</span>
            </Link>
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Search Bar */}
          <div className="desktop-search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <Search className="icon" />
              </button>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="navbar-right">
            {/* Cart */}
            <Link to="/cart" className="cart-link">
              <ShoppingCart className="cart-icon" />
              <span className="cart-count">{cartItemCount}</span>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="user-menu">
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="admin-link">
                    <LayoutDashboard className="icon" />
                  </Link>
                )}
                <Link to="/orders" className="orders-link">
                  <Package className="icon" />
                </Link>
                <div className="dropdown">
                  <button className="user-menu-button">
                    <User className="icon" />
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-menu-item">Profile</Link>
                    <Link to="/orders" className="dropdown-menu-item">Orders</Link>
                    <button onClick={handleLogout} className="dropdown-menu-item destructive">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-link">Sign in</Link>
                <Link to="/register" className="auth-button">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}