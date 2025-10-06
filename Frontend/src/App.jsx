import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';



import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';





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
            
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
        
            
            
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
