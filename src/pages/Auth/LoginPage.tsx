
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '@/store/slices/authSlice';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Loader1 from '@/components/ui/loader1';
import { Link } from 'react-router-dom';

// Form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    dispatch(loginUser(data) as any);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white font-roboto">
      <div className="bg-[#3CE7B2] h-2 w-full" />
      
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <div className="text-xl font-bold text-white">zenx</div>
        </div>
        <Button
          onClick={() => navigate('/register')}
          className="bg-[#2C2C2C] hover:bg-[#3CE7B2] hover:text-[#121212] text-white rounded-md px-4 py-2 transition-all duration-200"
        >
          Sign Up
        </Button>
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all duration-300">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-center text-gray-400 mb-6 text-base">
            Log in to your account to continue
          </p>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader1 className="w-10 h-10 text-[#3CE7B2]" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                  className={cn(
                    'w-full bg-[#2C2C2C] border border-[#2C2C2C] text-white rounded-md p-2 hover:border-[#3CE7B2] focus:border-[#3CE7B2] focus:ring-[#3CE7B2] text-base',
                    errors.email ? 'border-[#3CE7B2]' : ''
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-[#3CE7B2]">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-[#3CE7B2] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className={cn(
                      'w-full bg-[#2C2C2C] border border-[#2C2C2C] text-white rounded-md p-2 hover:border-[#3CE7B2] focus:border-[#3CE7B2] focus:ring-[#3CE7B2] text-base',
                      errors.password ? 'border-[#3CE7B2]' : ''
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-[#3CE7B2]">{errors.password.message}</p>
                )}
              </div>

              {error && <p className="text-sm text-[#3CE7B2]">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#3CE7B2] text-[#121212] hover:bg-[#27A98B] py-3 rounded-md font-medium text-base"
              >
                Sign in
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm text-gray-400">OR</div>
          
          <div className="mt-4 space-y-2">
            <Button
              type="button"
              className="w-full h-12 bg-[#2C2C2C] text-white hover:bg-[#3CE7B2] hover:text-[#121212] py-3 rounded-[100px] flex items-center justify-center text-base"
            >
              Sign in with Google
            </Button>
            <Button
              type="button"
              className="w-full h-12 bg-[#2C2C2C] text-white hover:bg-[#3CE7B2] hover:text-[#121212] py-3 rounded-[100px] flex items-center justify-center text-base"
            >
              Sign in with Github
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#3CE7B2] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
