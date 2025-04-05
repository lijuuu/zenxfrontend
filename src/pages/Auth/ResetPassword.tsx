
import axiosInstance from "@/utils/axiosInstance";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader1 from "@/components/ui/loader1"; 
import { toast } from "sonner"; 

// --- Loader Overlay Component ---
const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50">
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader1 className="w-12 h-12 text-[#3CE7B2]" />
      <div className="text-white text-xl opacity-80 font-roboto">
        Processing...
      </div>
      <button
        onClick={onCancel}
        className="text-white text-sm font-roboto underline hover:text-[#3CE7B2] transition-colors duration-200"
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
  const email = searchParams.get("email"); // Extract email from query params

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
        `http://localhost:7000/api/v1/auth/password/reset`, // Updated backend URL
        {
          email: email, // Use email as userID from query params
          token,
          newPassword: password,
          confirmPassword,
        }
      );
      setSuccess("Password reset successful. Redirecting to login...");
      toast.success("Password reset successful");
      setTimeout(() => navigate("/login"), 2000); // Navigate to login after 2 seconds
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
            setLoading(false); // Cancel loading state
          }}
        />
      )}
      <h1 className="text-4xl font-bold text-white mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all duration-300">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md bg-[#2C2C2C] text-white border border-[#2C2C2C] hover:border-[#3CE7B2] focus:outline-none focus:border-[#3CE7B2] focus:ring-[#3CE7B2] mb-4"
          disabled={loading || !token || !email}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 rounded-md bg-[#2C2C2C] text-white border border-[#2C2C2C] hover:border-[#3CE7B2] focus:outline-none focus:border-[#3CE7B2] focus:ring-[#3CE7B2] mb-4"
          disabled={loading || !token || !email}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-[#3CE7B2] text-[#121212] rounded-md hover:bg-[#27A98B] transition-colors duration-200 disabled:bg-gray-500"
          disabled={loading || !token || !email}
        >
          Submit
        </button>
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {success && <p className="text-green-400 text-center mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
