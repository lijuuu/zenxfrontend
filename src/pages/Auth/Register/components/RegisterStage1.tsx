
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Cookies from 'js-cookie';
import { loginUser, clearAuthState, setAuthLoading } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axiosInstance from '@/utils/axiosInstance';


// Form Schema
const stage1Schema = z.object({
  email: z.string().email('Use a valid email address'),
});

type Stage1FormData = z.infer<typeof stage1Schema>;

interface SignupFormProps extends React.ComponentPropsWithoutRef<'div'> {
  onNext: () => void;
  setFormData: (data: Stage1FormData) => void;
  initialData?: {
    email: string;
  };
}

function SignupForm({
  onNext,
  setFormData,
  initialData = { email: '' },
  className,
  ...props
}: SignupFormProps) {
  const { error } = useSelector((state: any) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<Stage1FormData>({
    resolver: zodResolver(stage1Schema),
    defaultValues: {
      email: initialData.email
    }
  });

  const dispatch = useDispatch();


  useEffect(() => {
    if (initialData.email) {
      setValue('email', initialData.email);
    }
  }, [initialData.email, setValue]);

  useEffect(() => {
    Cookies.remove('emailtobeverified');
  }, [error]);

  const onSubmit = (data: Stage1FormData) => {
    Cookies.set('emailtobeverified', data.email, { expires: 7, secure: true, sameSite: 'Strict' });
    setFormData(data);
    onNext();
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
      window.location.href = response.data.payload.url;
    } catch (err: any) {
      dispatch(setAuthLoading(false));
      const errorMessage = err.response?.data?.error?.message || "Failed to initiate Google login";
      toast.error(errorMessage);
      dispatch(clearAuthState());
    }
  };

  return (
    <div className="flex flex-col bg-zinc-950 text-white">
      <div className="flex justify-center items-center flex-1 pt-16">
        <div
          className={cn(
            'w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:border-zinc-700 transition-all duration-300',
            className
          )}
          {...props}
        >
          <div className="space-y-1">
            <h2 className="text-2xl text-center font-bold text-white">
              Create your account
            </h2>
            <p className="text-zinc-500 text-center text-sm">
              Register your account to access all that zenx has to offer
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
                  {...register('email')}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                />
                {errors.email && (
                  <p className="text-green-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              {error && <p className="text-sm text-green-500">{error.details}</p>}
              <Button
                type="submit"
                className="w-full bg-green-500 text-black hover:bg-green-600 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Continue
              </Button>
            </form>
            <div className="mt-4 text-center text-xs text-gray-400">OR</div>
            <div className="mt-4 space-y-2">
              <Button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="w-full h-12 bg-zinc-800 text-md text-white hover:bg-green-500 hover:text-black py-3 rounded-full flex items-center justify-center transition-all duration-200"
              >
                Sign up with Google
              </Button>
              <Button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="w-full h-12 bg-zinc-800 text-md text-white hover:bg-blue-500 hover:text-black py-3 rounded-full flex items-center justify-center transition-all duration-200"
              >
                Already a user? Login
              </Button>
              {/* <Button
                type="button"
                className="w-full h-12 bg-zinc-800 text-md text-white hover:bg-green-500 hover:text-black py-3 rounded-full flex items-center justify-center transition-all duration-200"
              >
                Sign up with Github
              </Button> */}
            </div>
            <p className="mt-4 text-center text-sm text-gray-400">
              By creating an account you certify that you agree to the{' '}
              <a href="#" className="underline hover:text-green-500 transition-colors duration-200">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
