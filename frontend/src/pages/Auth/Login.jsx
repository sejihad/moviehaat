import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  login,
  register,
  resetOtpMessage,
  resetOtpState,
  verifyOtp,
} from "../../actions/userAction";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    error,
    isAuthenticated,
    message,
    otpPending,
    otpUserId,
    otpMessage,
  } = useSelector((state) => state.user);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [registerConfirmPasswordVisible, setRegisterConfirmPasswordVisible] =
    useState(false);
  // Terms acceptance is temporarily disabled.
  // const [agreeTerms, setAgreeTerms] = useState(false);

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (isAuthenticated && !otpPending) {
      navigate("/");
    }

    const container = document.querySelector(".form-container");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    const handleRegisterClick = () => {
      container.classList.add("active");
    };

    const handleLoginClick = () => {
      container.classList.remove("active");
    };
    if (otpMessage) {
      toast.success(otpMessage);
      dispatch(resetOtpMessage());
    }
    if (message) {
      container.classList.remove("active");
      toast.success(message);
    }

    registerBtn?.addEventListener("click", handleRegisterClick);
    loginBtn?.addEventListener("click", handleLoginClick);

    return () => {
      registerBtn?.removeEventListener("click", handleRegisterClick);
      loginBtn?.removeEventListener("click", handleLoginClick);
    };
  }, [dispatch, isAuthenticated, navigate, message, otpPending, otpMessage]);

  useEffect(() => {
    if (performance.navigation.type === 1) {
      // Page was reloaded
      dispatch(resetOtpState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    // Terms acceptance validation is temporarily disabled.
    // if (!agreeTerms) {
    //   toast.error(
    //     "Please agree to the Terms and Conditions before registering."
    //   );
    //   return;
    // }
    // Password confirmation check
    if (registerPassword !== registerConfirmPassword) {
      return toast.error("Passwords do not match");
    }

    const formData = new FormData();
    formData.set("name", registerName);
    formData.set("email", registerEmail);
    formData.set("password", registerPassword);

    dispatch(register(formData));
  };

  const otpSubmit = (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    dispatch(verifyOtp(otpUserId, otp));
  };

  return (
    <div className="login-div">
      <div className="form-container">
        {/* OTP Verification Form */}
        <div className="form-box otp-verify">
          {otpPending ? (
            <form onSubmit={otpSubmit}>
              <span className="auth-kicker">Secure access</span>
              <h1>Verify OTP</h1>
              <p className="auth-intro">Enter the code sent to your account.</p>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter your OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={loginSubmit}>
              <span className="auth-kicker">MovieHaat account</span>
              <h1>Welcome back</h1>
              <p className="auth-intro">Sign in to continue your movie journey.</p>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="input-box password-box">
                <input
                  type={loginPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setLoginPasswordVisible(!loginPasswordVisible)}
                  className="password-toggle"
                  aria-label={loginPasswordVisible ? "Hide password" : "Show password"}
                >
                  {loginPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <div className="forgot-link">
                <Link to="/password/forgot">Forgot Password?</Link>
              </div>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
              <p>or login with social platforms</p>
              <div className="social-icons">
                <a
                  href={`${import.meta.env.VITE_API_URL}/api/v1/google`}
                  aria-label="Google"
                >
                  <FaGoogle className="icon" />
                </a>
              </div>
            </form>
          )}
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <form onSubmit={registerSubmit}>
            <span className="auth-kicker">Join MovieHaat</span>
            <h1>Create account</h1>
            <p className="auth-intro">One account for your next great watch.</p>
            <div className="input-box">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div className="input-box password-box">
              <input
                type={registerPasswordVisible ? "text" : "password"}
                placeholder="Password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setRegisterPasswordVisible(!registerPasswordVisible)
                }
                className="password-toggle"
                aria-label={registerPasswordVisible ? "Hide password" : "Show password"}
              >
                {registerPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
            <div className="input-box password-box">
              <input
                type={registerConfirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setRegisterConfirmPasswordVisible(
                    !registerConfirmPasswordVisible
                  )
                }
                className="password-toggle"
                aria-label={
                  registerConfirmPasswordVisible
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {registerConfirmPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>

            {/* Terms acceptance is temporarily disabled.
            <div className="terms-box">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkmark"></span>I agree to the{" "}
                <Link to="/terms" className="text-blue-600" target="_blank">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            */}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a
                href={`${import.meta.env.VITE_API_URL}/api/v1/google`}
                aria-label="Google"
              >
                <FaGoogle className="icon" />
              </a>
            </div>
          </form>
        </div>

        {/* Toggle Panel */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <div className="brand-orbit" aria-hidden="true"><span>MH</span></div>
            <span className="panel-kicker">Your screen. Your stories.</span>
            <h1>Discover what moves you.</h1>
            <p>New to MovieHaat? Create your account in a few seconds.</p>
            <button type="button" className="btn register-btn">Register</button>
          </div>
          <div className="toggle-panel toggle-right">
            <div className="brand-orbit" aria-hidden="true"><span>MH</span></div>
            <span className="panel-kicker">Back for another story?</span>
            <h1>Your seat is waiting.</h1>
            <p>Already have an account? Sign in and pick up where you left off.</p>
            <button type="button" className="btn login-btn">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
