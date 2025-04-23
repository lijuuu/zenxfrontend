
import axiosInstance from "@/utils/axiosInstance";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader1 from "@/components/ui/loader1";
import { toast } from "sonner";
import SimpleSpinLoader from "@/components/ui/simplespinloader";

// --- Loader Overlay Component ---
const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#121212] bg-opacity-95 z-50 font-roboto">
    <div className="flex flex-col items-center justify-center space-y-4">
      <SimpleSpinLoader className="w-12 h-12 text-green-700" />
      <div className="text-white text-xl opacity-80">
        Processing...
      </div>
      <button
        onClick={onCancel}
        className="text-white text-base underline hover:text-green-700 transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  </div>
);

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Redirect or show error if token or email is missing
  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or missing reset token or email.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        `http://localhost:7000/api/v1/auth/password/reset`,
        {
          email: email,
          token,
          newPassword: password,
          confirmPassword,
        }
      );
      setSuccess("Password reset successful. Redirecting to login...");
      toast.success("Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] flex flex-col items-center justify-center relative font-roboto">
      {loading && (
        <LoaderOverlay
          onCancel={() => {
            setLoading(false);
          }}
        />
      )}
      <h1 className="text-4xl font-bold text-white mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md bg-[#2C2C2C] text-white border border-[#2C2C2C] hover:border-green-700 focus:outline-none focus:border-green-700 focus:ring-green-700 mb-4 text-base"
          disabled={loading || !token || !email}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 rounded-md bg-[#2C2C2C] text-white border border-[#2C2C2C] hover:border-green-700 focus:outline-none focus:border-green-700 focus:ring-green-700 mb-4 text-base"
          disabled={loading || !token || !email}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-green-700  text-[#121212] rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-[#2C2C2C] text-base font-medium"
          disabled={loading || !token || !email}
        >
          Submit
        </button>
        {error && <p className="text-green-700 text-center mt-4 text-base">{error}</p>}
        {success && <p className="text-green-400text-center mt-4 text-base">{success}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
