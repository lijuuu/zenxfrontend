import MainNavbar from "@/components/common/MainNavbar";
import { handleInfo } from "@/components/sub/ErrorToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SimpleSpinLoader from "@/components/ui/simplespinloader";
import { clearAuthState, loginUser, setAuthLoading } from "@/store/slices/authSlice";
import axiosInstance from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

//TODO - forced to use href location instead of navigate, figure out y it fails to fetch getprofile as soon as login happens

// loader overlay for loading state
const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] bg-opacity-95 z-50">
    <SimpleSpinLoader className="w-12 h-12 text-green-500" />
  </div>
);

// login form component
function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // login schema with zod validation
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

  // watch email field
  const formEmail = watch("email");

  // handle email login submission
  const onSubmit = (data: LoginFormData) => {
    dispatch(
      loginUser({
        email: data.email,
        password: data.password,
        code: data.code,
      }) as any
    );
  };

  // handle google login
  const handleGoogleLogin = async () => {
    try {
      dispatch(setAuthLoading(true));
      // check for existing session
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        toast.error("You are already logged in. Please log out to use Google login.");
        dispatch(setAuthLoading(false));
        return;
      }
      // initiate google oauth
      const response = await axiosInstance.get("/auth/google/login");
      navigate(response.data.payload.url); //google url dont touch
      
    } catch (err: any) {
      dispatch(setAuthLoading(false));
      const errorMessage = err.response?.data?.error?.message || "Failed to initiate Google login";
      toast.error(errorMessage);
      dispatch(clearAuthState());
    }
  };

  // handle auth state and navigation
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (userProfile?.isVerified && accessToken) {
      // window.location.href = "/dashboard";
      navigate("/dashboard")
      toast.success(successMessage || "Login successful!");
    } else if (error) {
      if (error?.type === "ERR_LOGIN_NOT_VERIFIED") {
        Cookies.set("emailtobeverified", formEmail);
        navigate("/verify-info");
        handleInfo(error);
      } else if (error?.type === "ERR_LOGIN_METHOD_CONFLICT") {
        toast.error(error.message || "Account exists with a different login method. Try another method.");
      } else {
        toast.error(error.message || "An error occurred");
      }
      dispatch(clearAuthState());
    }
  }, [isAuthenticated, userProfile, loading, error, navigate, successMessage, dispatch, formEmail]);

  // check for existing session on mount
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      // window.location.href= "/dashboard";
      navigate("/dashboard")
      
      toast.success("Logged in!");
    }
  }, [navigate]);

  // check 2fa status
  useEffect(() => {
    if (formEmail && formEmail.includes("@") && formEmail.includes(".")) {
      axiosInstance
        .get(`/auth/2fa/status`, {
          params: { email: formEmail },
          headers: { "X-Requires-Auth": "false" },
        })
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

  // handle URL params for OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const success = urlParams.get('success');
    const type = urlParams.get('type');
    const message = urlParams.get('message');
    const details = urlParams.get('details');

    if (success === 'false' && message) {
      setTimeout(() => {
        toast.error(message, {
          description: details || type,
          duration: 5000,
        });
      }, 0); // Queue toast for next event loop
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      Cookies.set('accessToken', accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });

      Cookies.set('refreshToken', refreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });

      window.history.replaceState({}, document.title, window.location.pathname);
      // window.location.href= "/dashboard";
      navigate("/dashboard")
      
      toast.success('logged in successfully!');
    }
  }, [navigate, location]);

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
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-zinc-800 text-md text-white hover:bg-green-500 hover:text-black py-3 rounded-full flex items-center justify-center transition-all duration-200"
                disabled={loading}
              >
                Login with Google
              </Button>
              {/* <Button
                type="button"
                className="w-full h-12 bg-zinc-800 text-md text-white hover:bg-green-500 hover:text-black py-3 rounded-full flex items-center justify-center transition-all duration-200"
                disabled={loading}
              >
                Login with Github
              </Button> */}
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
