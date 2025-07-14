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
    <div className="flex flex-col bg-zinc-950 text-white">
      <div className="flex justify-center items-center flex-1">
        <div
          className={cn(
            'w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:border-zinc-700 transition-all duration-300',
            className
          )}
          {...props}
        >
          <h1 className="text-2xl font-bold text-center mb-2 text-white">
            Welcome, {email}
          </h1>
          <p className="text-center text-zinc-500 mb-6 text-sm">
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
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
              />
              {errors.password && (
                <p className="text-green-500 text-sm">{errors.password.message}</p>
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
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
              />
              {errors.confirmPassword && (
                <p className="text-green-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex justify-between space-x-2">
              <Button
                type="button"
                onClick={onBack}
                className="w-1/2 bg-zinc-800 text-white hover:bg-green-500 hover:text-black py-3 rounded-md transition-colors duration-200"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-green-500 text-black hover:bg-green-600 py-3 rounded-md font-medium transition-colors duration-200"
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
