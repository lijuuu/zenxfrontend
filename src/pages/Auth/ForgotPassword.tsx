import axiosInstance from "@/utils/axiosInstance";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader1 from "@/components/ui/loader1";
import { toast } from "sonner";
import emailIcon from "@/assets/email.png";
import SimpleSpinLoader from "@/components/ui/simplespinloader";
import MainNavbar from "@/components/common/MainNavbar";

// --- Loader Overlay Component ---
const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 bg-opacity-95 z-50">
    <div className="flex flex-col items-center justify-center space-y-4">
      <SimpleSpinLoader className="w-12 h-12 text-green-500 mb-8" />
      <div className="text-white text-xl opacity-80 mt-8">
        Sending reset link...
      </div>
      <button
        onClick={onCancel}
        className="text-zinc-500 text-base underline hover:text-green-500 transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  </div>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Redirect to home if accessToken exists
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000'}/api/v1/auth/password/forgot`,
        { email }
      );
      setSuccess("Password reset link sent to your email. Please check your inbox.");
      toast.success("Password reset link sent successfully", {
        style: { background: 'zinc-900', color: 'green-500' },
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to send reset link. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        style: { background: 'zinc-900', color: 'white' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center relative">
      <MainNavbar/>
      {loading && (
        <LoaderOverlay
          onCancel={() => {
            setLoading(false);
          }}
        />
      )}
      {success ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <img
            src={emailIcon}
            alt="email"
            className="w-[200px] h-[200px] hover:rotate-12 transition-transform duration-300 ease-in-out hover:scale-150"
            onClick={() => {
              window.location.href = "https://mail.google.com";
            }}
          />
          <h1 className="text-4xl font-bold text-white">
            Check your email
          </h1>
          <p className="text-lg text-center text-zinc-500">{email}</p>
          <p className="text-base text-zinc-500 mt-2">{success}</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:border-zinc-700 transition-all duration-300">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Forgot Password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-base text-white block font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-zinc-800 text-white border border-zinc-700 hover:border-green-500 focus:outline-none focus:border-green-500 focus:ring-green-500 transition-all duration-200 disabled:bg-zinc-800 disabled:opacity-50 text-base"
                disabled={loading}
                required
              />
              {error && (
                <p className="text-green-500 text-sm text-center mt-2">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-black rounded-md hover:bg-green-600 transition-colors duration-200 font-medium text-base disabled:bg-zinc-800 disabled:text-zinc-500"
              disabled={loading}
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;