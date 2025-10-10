//import { Link, useNavigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Search, Moon, Sun, Heart } from 'lucide-react';
import { useEffect, useState , useRef } from 'react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { assets } from '../assets/assets';
import '../styles/components/Navbar.css';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {});
      fetchWishlist().catch(() => {});
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            {/* Wishlist */}
            <Link to="/wishlist" className="wishlist-link">
              <Heart className="wishlist-icon" />
              {wishlistItems.length > 0 && (
                <span className="wishlist-count">{wishlistItems.length}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="cart-link">
              <ShoppingCart className="cart-icon" />
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
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
                <div className="dropdown" ref={dropdownRef}>
                  <button 
                    className="user-menu-button" 
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-expanded={showDropdown}
                    aria-haspopup="true"
                  >
                    <User className="icon" />
                  </button>
                  <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                    <Link to="/profile" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                      Profile
                    </Link>
                    <Link to="/orders" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                      Orders
                    </Link>
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }} 
                      className="dropdown-menu-item destructive"
                    >
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