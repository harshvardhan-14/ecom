import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { authAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import '../styles/pages/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login">
      <div className="login__container">
        <header className="login__header">
          <LogIn className="login__icon" size={32} />
          <h1 className="login__title">Welcome Back</h1>
          <p className="login__subtitle">Sign in to your account</p>
        </header>

        <form onSubmit={handleSubmit} className="login__form">
          <div className="login__form-group">
            <label htmlFor="email" className="login__form-group-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login__form-group-input"
              required
              autoComplete="email"
              autoFocus
              aria-required="true"
            />
          </div>

          <div className="login__form-group">
            <div className="login__form-group-header">
              <label htmlFor="password" className="login__form-group-label">
                Password
              </label>
              <div className="login__forgot-password">
                <Link to="/forgot-password" aria-label="Forgot your password?">
                  Forgot password?
                </Link>
              </div>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login__form-group-input"
              required
              autoComplete="current-password"
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="login__button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="login__button-spinner" size={20} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="login__divider">
          <span className="login__divider-text">Or continue with</span>
        </div>

        <div className="login__social-buttons">
          <button
            type="button"
            className="login__social-button"
            onClick={() => {}}
            aria-label="Sign in with Google"
          >
            <svg className="login__social-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <span className="sr-only">Sign in with Google</span>
          </button>

          
        </div>

        <footer className="login__footer">
          Don't have an account?{' '}
          <Link to="/register" className="login__footer-link">
            Sign up
          </Link>
        </footer>
      </div>
    </div>
  );
}