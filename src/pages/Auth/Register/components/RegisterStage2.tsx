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
    <div className="flex flex-col bg-[#121212] text-white">
      <div className="flex justify-center items-center flex-1 p-4">
        <div
          className={cn(
            'w-full max-w-md bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg mt-24 hover:border-gray-700 transition-all duration-300',
            className
          )}
          {...props}
        >
          <h1 className="text-2xl font-bold text-center mb-2 text-white font-roboto">
            Welcome, {email}
          </h1>
          <p className="text-center text-gray-400 mb-6 text-base font-roboto">
            Please enter your name
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* First Name Input */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-white font-roboto">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register('firstName')}
                className={cn(
                  'w-full bg-[#2C2C2C] border border-[#2C2C2C] text-white rounded-md p-2 hover:border-[#3CE7B2] focus:border-[#3CE7B2] focus:ring-[#3CE7B2] text-base font-roboto',
                  errors.firstName ? 'border-[#3CE7B2]' : ''
                )}
              />
              {errors.firstName && (
                <p className="text-sm text-[#3CE7B2]">{errors.firstName.message}</p>
              )}
            </div>
            {/* Last Name Input */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-white font-roboto">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register('lastName')}
                className={cn(
                  'w-full bg-[#2C2C2C] border border-[#2C2C2C] text-white rounded-md p-2 hover:border-[#3CE7B2] focus:border-[#3CE7B2] focus:ring-[#3CE7B2] text-base font-roboto',
                  errors.lastName ? 'border-[#3CE7B2]' : ''
                )}
              />
              {errors.lastName && (
                <p className="text-sm text-[#3CE7B2]">{errors.lastName.message}</p>
              )}
            </div>
            {/* Navigation Buttons */}
            <div className="flex justify-between space-x-2">
              <Button
                type="button"
                onClick={onBack}
                className="w-1/2 bg-[#2C2C2C] text-white hover:bg-[#3CE7B2] hover:text-[#121212] py-3 rounded-md text-base font-roboto transition-colors duration-300"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-[#3CE7B2] text-[#121212] hover:bg-[#27A98B] py-3 rounded-md font-medium text-base font-roboto transition-colors duration-300"
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
