import React, { useEffect, useState } from "react";
import image from "@/assets/email.png";
import { resendEmail, setAuthLoading } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AvatarHopLoading from '@/components/common/AvatarHopLoading';


const VerifyInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [emailVerified, setEmailVerified] = useState("");

  const { successMessage, error, expiryAt, loading } = useSelector((state: any) => state.auth);

  const handleResendEmail = () => {
    if (emailVerified) {
      dispatch(resendEmail({ email: emailVerified }) as any);
    }
  };

  useEffect(() => {
    const email = Cookies.get("emailtobeverified");
    const state = localStorage.getItem("state");

    if (!email) {
      navigate("/login");
      return;
    }

    setEmailVerified(email);

    if (state === "VERIFY_EMAIL_REQUEST_FORCE_SENT") {
      localStorage.removeItem("state");
      // console.log("VERIFY_EMAIL_REQUEST_FORCE_SENT");

      // ensure email is set before dispatch
      setTimeout(() => {
        dispatch(resendEmail({ email }) as any);
      }, 0);
    }
  }, [dispatch, navigate]);

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

  useEffect(() => {
    if (successMessage && !loading) {
      toast.success(successMessage);
    }

    if (error?.type === "ERR_ALREADY_VERIFIED") {
      navigate("/login");
      toast.success("User already verified, please login again.");
    }
    if (error && !loading) {
      toast.error(error.message || "Failed to send email");
    }
  }, [successMessage, error, loading]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      navigate("/home");
    }
  }, []);

  const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-95 z-50 ">
      <AvatarHopLoading message ="Sending.." />
      <div className="text-green-400 text-xl opacity-80 mt-24">
        Sending verification email...
      </div>
      <button
        onClick={onCancel}
        className="text-green-300 text-base mt-4 underline hover:text-green-500 transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen relative  bg-gradient-to-br from-black via-green-950 to-black">
      {loading && <LoaderOverlay onCancel={() => dispatch(setAuthLoading(false))} />}
      <img
        src={image}
        alt="verify info"
        className="w-[200px] h-[200px] hover:rotate-12 transition-transform duration-300 ease-in-out hover:scale-150 cursor-pointer saturate-50 hue-rotate-15"
        onClick={() => {
          window.location.href = "https://mail.google.com";
        }}
      />
      <h1 className="text-4xl font-bold text-green-200 mt-4">Verify your email</h1>
      <p className="text-base text-green-100 mt-2">
        Check your email for a verification link.
      </p>
      <p className="text-lg text-center text-green-100 mt-2">{emailVerified}</p>
      {remainingTime !== null && remainingTime > 0 ? (
        <p className="text-base text-green-100 mt-2">
          Wait {remainingTime} seconds to resend email
        </p>
      ) : (
        <button
          className="text-base text-black bg-green-400 hover:bg-green-500 px-6 py-2 rounded-lg mt-6 font-semibold shadow-lg transition-all duration-300"
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
