
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form Schema
const stage4Schema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be less than 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must have uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type Stage4FormData = z.infer<typeof stage4Schema>;

interface RegisterStage4Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onSubmit'> {
  email: string;
  onBack: () => void;
  onSubmit: (data: Stage4FormData) => void;
}

function RegisterStage4({ email, onBack, onSubmit, className, ...props }: RegisterStage4Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Stage4FormData>({
    resolver: zodResolver(stage4Schema),
  });

  const onFormSubmit = (data: Stage4FormData) => {
    onSubmit(data);
  };

  return (
    <div className="flex flex-col bg-[#121212] text-white">
      <div className="flex justify-center items-center flex-1 p-4">
        <div
          className={cn(
            'w-full max-w-md bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg mt-24 hover:border-gray-700',
            className
          )}
          {...props}
        >
          <h1 className="text-2xl font-bold text-center mb-2 text-white font-inter">
            Welcome, {email}
          </h1>
          <p className="text-center text-gray-400 mb-6 text-sm font-inter">
            Please set your password
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={cn(
                  'w-full bg-[#2C2C2C] border border-[#2C2C2C] text-white rounded-md p-2 hover:border-[#3CE7B2] focus:border-[#3CE7B2] focus:ring-[#3CE7B2]',
                  errors.password ? 'border-[#3CE7B2]' : ''
                )}
              />
              {errors.password && (
                <p className="text-xs text-[#3CE7B2]">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={cn(
                  'w-full bg-[#2C2C2C] border border-[#2C2C2C] text-white rounded-md p-2 hover:border-[#3CE7B2] focus:border-[#3CE7B2] focus:ring-[#3CE7B2]',
                  errors.confirmPassword ? 'border-[#3CE7B2]' : ''
                )}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#3CE7B2]">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex justify-between space-x-2">
              <Button
                type="button"
                onClick={onBack}
                className="w-1/2 bg-[#2C2C2C] text-white hover:bg-[#3CE7B2] hover:text-[#121212] py-3 rounded-md"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-[#3CE7B2] text-[#121212] hover:bg-[#27A98B] py-3 rounded-md"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterStage4;
