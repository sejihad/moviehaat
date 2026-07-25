import { useEffect, useState } from "react";
import { FiArrowLeft, FiKey, FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, forgotPassword } from "../../actions/userAction";
import "./ForgotPassword.css";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const { loading, message, error } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
    }
  }, [message, error, dispatch, isAuthenticated, navigate]);

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-card">
        <section className="forgot-password-visual" aria-hidden="true">
          <div className="forgot-brand-mark">MH</div>
          <div className="forgot-key-visual">
            <span className="forgot-orbit forgot-orbit-one"></span>
            <span className="forgot-orbit forgot-orbit-two"></span>
            <div className="forgot-key-icon">
              <FiKey />
            </div>
          </div>
          <div className="forgot-visual-copy">
            <span>Secure account recovery</span>
            <h2>Lost the key?</h2>
            <p>We’ll help you get back to your MovieHaat watchlist.</p>
          </div>
        </section>

        <section className="forgot-password-form-panel">
          <Link to="/login" className="forgot-back-link">
            <FiArrowLeft />
            Back to login
          </Link>

          <div className="forgot-form-content">
            <span className="forgot-kicker">MovieHaat account</span>
            <h1>Forgot password?</h1>
            <p className="forgot-intro">
              Enter the email linked to your account and we’ll send you a reset
              link.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="forgot-email">Email address</label>
              <div className="forgot-input-box">
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FiMail aria-hidden="true" />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="forgot-mobile-back">
              Remember your password? <Link to="/login">Login</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;
