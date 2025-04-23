import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useCountries from '@/hooks/useCountries';

// Form Schema
const stage3Schema = z.object({
  country: z.string().min(1, 'Country is required'),
  profession: z.string().min(1, 'Profession is required'),
});

type Stage3FormData = z.infer<typeof stage3Schema>;

const professions = [
  'Student',
  'Software Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Frontend Developer',
  'Backend Developer',
  'QA Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Others',
];

const CountriesWithFlags = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { countries } = useCountries();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (name: string) => {
    onChange(name);
    setDropdownOpen(false);
  };

  const selectedCountryCode = value
    ? Object.keys(countries).find((code) => countries[code] === value)
    : '';

  return (
    <div className="relative w-full">
      <Label className="block text-sm font-medium text-white">Country</Label>
      <div
        className="flex items-center justify-between bg-zinc-800 text-white p-3 rounded-md mt-1 cursor-pointer hover:border-green-500 border border-zinc-700 transition-all duration-200"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {value && selectedCountryCode ? (
          <div className="flex items-center space-x-2">
            <img
              src={`https://flagcdn.com/24x18/${selectedCountryCode.toLowerCase()}.png`}
              alt={`${value} flag`}
              className="w-6 h-6"
            />
            <span>{value}</span>
          </div>
        ) : (
          <span>Select a country</span>
        )}
        <span>▼</span>
      </div>
      {dropdownOpen && (
        <div className="absolute w-full bg-zinc-900 text-white mt-2 max-h-60 overflow-y-auto rounded-xl shadow-lg z-10 border border-zinc-800">
          {Object.entries(countries)
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([code, name]) => (
              <div
                key={code}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-zinc-800 cursor-pointer transition-colors duration-200"
                onClick={() => handleSelect(name)}
              >
                <img
                  src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
                  alt={`${name} flag`}
                  className="w-6 h-6"
                />
                <span>{name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

interface RegisterStage3Props extends React.ComponentPropsWithoutRef<'div'> {
  email: string;
  onNext: (data: Stage3FormData) => void;
  onBack: () => void;
  setFormData: (data: Stage3FormData) => void;
  initialData?: {
    country: string;
    profession: string;
  };
}

function RegisterStage3({
  email,
  onNext,
  onBack,
  setFormData,
  initialData = { country: '', profession: '' },
  className,
  ...props
}: RegisterStage3Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<Stage3FormData>({
    resolver: zodResolver(stage3Schema),
    defaultValues: {
      country: initialData.country,
      profession: initialData.profession,
    },
  });

  useEffect(() => {
    if (initialData.country) {
      setValue('country', initialData.country);
    }
    if (initialData.profession) {
      setValue('profession', initialData.profession);
    }
  }, [initialData, setValue]);

  const onSubmit = (data: Stage3FormData) => {
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
            Please provide your user information
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CountriesWithFlags value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.country && (
                <p className="text-green-500 text-sm">{errors.country.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm text-white">
                Profession
              </Label>
              <select
                id="profession"
                {...register('profession')}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
              >
                <option value="">Select a profession</option>
                {professions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
              {errors.profession && (
                <p className="text-green-500 text-sm">{errors.profession.message}</p>
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

export default RegisterStage3;
