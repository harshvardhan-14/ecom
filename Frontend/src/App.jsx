import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import './App.css';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
           
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            
            {/* Additional Pages */}
            <Route path="/about" element={
              <div className="page-container">
                <h1 className="page-title">About Us</h1>
                <p className="page-text">We are a leading e-commerce platform offering the best products at competitive prices.</p>
              </div>
            } />
            <Route path="/contact" element={
              <div className="page-container">
                <h1 className="page-title">Contact Us</h1>
                <p className="page-text">Email: support@ecommerce.com</p>
                <p className="page-text">Phone: (123) 456-7890</p>
              </div>
            } />
            <Route path="/shipping" element={
              <div className="page-container">
                <h1 className="page-title">Shipping Information</h1>
                <p className="page-text">We offer fast and reliable shipping to all locations.</p>
              </div>
            } />
            <Route path="/returns" element={
              <div className="page-container">
                <h1 className="page-title">Returns Policy</h1>
                <p className="page-text">30-day return policy on all products.</p>
              </div>
            } />
            <Route path="/faq" element={
              <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">How do I track my order?</h2>
                    <p className="text-gray-600">You will receive a tracking number via email once your order ships.</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">What payment methods do you accept?</h2>
                    <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers.</p>
                  </div>
                </div>
              </div>
            } />
            
           
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
