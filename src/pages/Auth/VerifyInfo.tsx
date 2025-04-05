
import React, { useEffect, useState } from "react";
import image from "@/assets/email.png";
import { resendEmail, setAuthLoading } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader1 from "@/components/ui/loader1";

const VerifyInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState<number | null>(null); // Time in seconds
  const [emailVerified, setEmailVerified] = useState("");

  const { successMessage, error, expiryAt, loading } = useSelector((state: any) => state.auth);

  // Set email from cookie on mount
  useEffect(() => {
    const email = Cookies.get("emailtobeverified");
    if (!email) {
      navigate("/login");
    } else {
      setEmailVerified(email);
      // dispatch(resendEmail({ email }) as any);
    }
  }, [dispatch, navigate]);

  // Update remaining time based on expiryAt
  useEffect(() => {
    if (expiryAt) {
      const updateCountdown = () => {
        const currentTime = Math.floor(Date.now() / 1000); 
        const timeLeft = expiryAt - currentTime;
        setRemainingTime(timeLeft > 0 ? timeLeft : 0);
      };

      updateCountdown(); 
      const interval = setInterval(updateCountdown, 1000); 

      return () => clearInterval(interval);
    }
  }, [expiryAt]);

  // Handle success and error messages
  useEffect(() => {
    if (successMessage && !loading) {
      toast.success(successMessage);
    }
    if (error?.type == "ERR_ALREADY_VERIFIED"){
      navigate("/login")
      toast.success("User Already Verfied, Please Login once again")
    }
    if (error && !loading) {
      toast.error(error.message || "Failed to send email");
    }
    
  }, [successMessage, error, loading]);

  const handleResendEmail = () => {
    if (emailVerified) {
      dispatch(resendEmail({ email: emailVerified }) as any);
    }
  };

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      navigate("/home");
    }
  }, []);

  const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-95 z-50">
      <Loader1 className="w-12 h-12 mr-10 text-[#3CE7B2]" />
      <div className="text-white text-xl opacity-80 font-roboto mt-24">
        Sending verification email...
      </div>
      <button
        onClick={onCancel}
        className="text-white text-sm font-roboto mt-4 underline hover:text-[#3CE7B2] transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen relative bg-[#121212] font-roboto">
      {loading && <LoaderOverlay onCancel={() => dispatch(setAuthLoading(false))} />}
      <img
        src={image}
        alt="verify info"
        className="w-[200px] h-[200px] hover:rotate-12 transition-transform duration-300 ease-in-out hover:scale-150"
        onClick={() => {
          window.location.href = "https://mail.google.com";
        }}
      />
      <h1 className="text-4xl font-bold text-white mix-blend-difference">Verify your email</h1>
      <p className="text-sm text-gray-400 mt-2">
        Check your email for a verification link.
      </p>
      <p className="text-md text-center text-gray-400 mt-2">{emailVerified}</p>
      {remainingTime !== null && remainingTime > 0 ? (
        <p className="text-sm text-gray-400 mt-2">
          Wait {remainingTime} seconds to resend email
        </p>
      ) : (
        <button
          className="text-sm text-[#121212] bg-[#3CE7B2] hover:bg-[#27A98B] px-4 py-2 rounded-md mt-5"
          onClick={handleResendEmail}
          disabled={loading}
        >
          {loading ? "Resending..." : "Send Verification Email"}
        </button>
      )}
    </div>
  );
};

export default VerifyInfo;
