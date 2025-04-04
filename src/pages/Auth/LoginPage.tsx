
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearAuthState, setAuthLoading, resendEmail } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Loader1 from "@/components/ui/loader1";
import { handleError, handleInfo } from "@/components/sub/ErrorToast";
import MainNavbar from "@/components/common/MainNavbar";
import axios from "axios";

const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] bg-opacity-95 z-50">
    <Loader1 className="w-12 h-12 mr-10 text-green-500" />
    <div className="text-white text-xl opacity-80 mt-24">
      Logging in...
    </div>
    <button
      onClick={onCancel}
      className="text-gray-400 text-sm mt-4 underline hover:text-green-500 transition-colors duration-200"
    >
      Cancel
    </button>
  </div>
);

// --- LoginForm Component ---
function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const loginSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must have uppercase, lowercase, number, and special character"
          )
          .max(20, "Password must be less than 20 characters"),
        code: twoFactorEnabled
          ? z.string().min(6, "Code must be 6 characters").nonempty("2FA code is required")
          : z.string().optional(),
      }),
    [twoFactorEnabled]
  );

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { error, loading, userProfile, successMessage, isAuthenticated } = useSelector((state: any) => state.auth);

  // Watch the email field from the form
  const formEmail = watch("email");

  const onSubmit = (data: LoginFormData) => {
    // Ensure we pass all required fields with proper types
    dispatch(loginUser({
      email: data.email,
      password: data.password,
      code: data.code
    }) as any);
  };

  // Single useEffect for auth state and navigation
  useEffect(() => {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
    
    if (isAuthenticated && userProfile?.isVerified && !loading && !error) {
      navigate(from);
      toast.success(successMessage || "Login successful!");
    } else if (error && !loading) {
      if (error?.type === "ERR_LOGIN_NOT_VERIFIED") {
        Cookies.set("emailtobeverified", formEmail);
        navigate("/verify-info");
        handleInfo(error);
      } else {
        toast.error(error.message || "An error occurred");
      }
      dispatch(clearAuthState());
    }
  }, [error, loading, userProfile, isAuthenticated, successMessage, formEmail, dispatch, navigate, location]);

  // Check for existing session on mount
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigate("/dashboard");
      toast.success("Logged in!");
    }
  }, [navigate]);

  useEffect(() => {
    if (formEmail && formEmail.includes("@") && formEmail.includes(".")) {
      axios
        .get(`http://localhost:7000/api/v1/auth/2fa/status?email=${formEmail}`)
        .then((res: any) => {
          setTwoFactorEnabled(res.data.payload.isEnabled);
        })
        .catch((err: any) => {
          setTwoFactorEnabled(false);
        });
    } else {
      setTwoFactorEnabled(false);
    }
  }, [formEmail]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <MainNavbar isAuthenticated={false} />
      <div className="flex justify-center items-center flex-1 pt-16">
        {loading && <LoaderOverlay onCancel={() => dispatch(setAuthLoading(false))} />}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6 hover:border-zinc-700 transition-all duration-300">
          <div className="space-y-1">
            <h2 className="text-2xl text-center font-bold text-white">
              Login to your account
            </h2>
            <p className="text-zinc-500 text-center text-sm">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-green-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm text-white">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-green-500 text-start mt-2 text-sm">{errors.password.message}</p>
                )}
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 text-center text-sm mb-4 text-gray-400">
                  <p>Two-factor authentication is enabled for your account.</p>
                  <p>Please enter the code from your authenticator app.</p>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter the code"
                    {...register("code")}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 mt-4 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                  />
                  {errors.code && (
                    <p className="text-green-500 text-sm mt-4">{errors.code.message}</p>
                  )}
                </div>
              )}
              {error && !loading && (
                <p className="text-green-500 text-sm">Login failed</p>
              )}

              <Button
                type="submit"
                className="w-full bg-green-500 text-black hover:bg-green-600 py-3 rounded-md transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-gray-400">OR</div>
            <div className="mt-4 space-y-2">
              <Button
                type="button"
                className="w-full h-12 bg-zinc-800 text-md text-white hover:bg-green-500 hover:text-black py-3 rounded-full flex items-center justify-center transition-all duration-200"
              >
                Sign up with Google
              </Button>
              <Button
                type="button"
                className="w-full h-12 bg-zinc-800 text-md text-white hover:bg-green-500 hover:text-black py-3 rounded-full flex items-center justify-center transition-all duration-200"
              >
                Sign up with Github
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400 flex">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-sm underline-offset-4 hover:text-green-500 transition-colors duration-200"
                >
                  Don't have an account?{" "}
                </button>
              )}

              <a
                href="/forgot-password"
                className="ml-auto text-sm text-gray-400 hover:text-green-500 transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
