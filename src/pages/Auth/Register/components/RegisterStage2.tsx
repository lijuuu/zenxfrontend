import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form Schema
const stage2Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type Stage2FormData = z.infer<typeof stage2Schema>;

interface RegisterStage2Props extends React.ComponentPropsWithoutRef<'div'> {
  email: string;
  onNext: (data: Stage2FormData) => void;
  onBack: () => void;
  setFormData: (data: Stage2FormData) => void;
  initialData?: {
    firstName: string;
    lastName: string;
  };
}

function RegisterStage2({
  email,
  onNext,
  onBack,
  setFormData,
  initialData = { firstName: '', lastName: '' },
  className,
  ...props
}: RegisterStage2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<Stage2FormData>({
    resolver: zodResolver(stage2Schema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName
    }
  });

  useEffect(() => {
    if (initialData.firstName) {
      setValue('firstName', initialData.firstName);
    }
    if (initialData.lastName) {
      setValue('lastName', initialData.lastName);
    }
  }, [initialData, setValue]);

  const onSubmit = (data: Stage2FormData) => {
    setFormData(data);
    onNext(data);
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
          <h1 className="text-2xl font-bold text-center mb-2 text-white">
            Welcome, {email}
          </h1>
          <p className="text-center text-zinc-500 mb-6 text-sm">
            Please enter your name
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register('firstName')}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
              />
              {errors.firstName && (
                <p className="text-green-500 text-sm">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register('lastName')}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
              />
              {errors.lastName && (
                <p className="text-green-500 text-sm">{errors.lastName.message}</p>
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
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterStage2;
