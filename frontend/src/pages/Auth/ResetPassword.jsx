import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, resetPassword } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    dispatch(resetPassword(token, { password, confirmPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Password updated successfully!");
      navigate("/login");
    }
  }, [dispatch, error, success, navigate]);

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Reset Password" />
      <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">
        <FaExclamationTriangle className="text-yellow-600" />
        If you are logged in with Google, you can log in without a password.
      </div>
      <div className="flex min-h-screen items-center justify-center bg-[#080a0f] px-4 py-12">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#121722] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-white">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block font-medium text-[#d7dce6]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-white/10 bg-[#0d1119] px-5 py-3 pr-12 text-base font-medium text-white outline-none placeholder:text-[#737d91] focus:border-[#e50914] focus:ring-4 focus:ring-[#e50914]/10"
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-[#a8b0c0]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#d7dce6]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-white/10 bg-[#0d1119] px-5 py-3 pr-12 text-base font-medium text-white outline-none placeholder:text-[#737d91] focus:border-[#e50914] focus:ring-4 focus:ring-[#e50914]/10"
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-[#a8b0c0]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-[#e50914] py-3 font-semibold text-white shadow-md transition hover:bg-[#ff1f2a]"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#a8b0c0]">
            Remembered your password?
            <Link
              to="/login"
              className="ml-1 font-medium text-[#ff5962] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
