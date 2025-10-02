import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
//import '../styles/components/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About */}
          <div className="footer-section">
            <h3 className="footer-title">ShopHub</h3>
            <p className="footer-description">
              Your one-stop destination for quality products at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <Link to="/products" className="footer-link">
                  Products
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-heading">Customer Service</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/shipping" className="footer-link">
                  Shipping Info
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/returns" className="footer-link">
                  Returns & Exchanges
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Mail className="footer-icon" />
                <a href="mailto:contact@shophub.com" className="footer-link">
                  contact@shophub.com
                </a>
              </div>
              <div className="footer-social-links">
                <a href="#" className="footer-social-link">
                  <Facebook className="footer-social-icon" />
                </a>
                <a href="#" className="footer-social-link">
                  <Twitter className="footer-social-icon" />
                </a>
                <a href="#" className="footer-social-link">
                  <Instagram className="footer-social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

