import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';
import '../styles/pages/Register.css';


const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="register">
      <div className="register__container">
        <header className="register__header">
          <UserPlus className="register__icon" size={32} />
          <h1 className="register__title">Create an account</h1>
          <p className="register__subtitle">Join our community today</p>
        </header>

        <form onSubmit={handleSubmit} className="register__form">
          {error && <div className="register__error">{error}</div>}

          <div className="register__form-grid">
            <div className="register__form-group">
              <label htmlFor="firstName" className="register__form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="register__form-input"
                required
                aria-required="true"
              />
            </div>

            <div className="register__form-group">
              <label htmlFor="lastName" className="register__form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="register__form-input"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="register__form-group">
            <label htmlFor="email" className="register__form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="register__form-input"
              required
              autoComplete="username"
              aria-required="true"
            />
          </div>

          <div className="register__form-group">
            <label htmlFor="password" className="register__form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="register__form-input"
              required
              minLength={6}
              autoComplete="new-password"
              aria-required="true"
            />
          </div>

          <div className="register__form-group">
            <label htmlFor="confirmPassword" className="register__form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="register__form-input"
              required
              minLength={6}
              autoComplete="new-password"
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="register__button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="register__button-spinner" size={20} />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <footer className="register__footer">
          Already have an account?{' '}
          <Link to="/login" className="register__footer-link">
            Sign in
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Register;
