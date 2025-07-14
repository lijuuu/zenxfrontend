import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { registerUser, clearAuthState as clearAuthInitialState } from '@/store/slices/authSlice';
import SignupForm from './components/RegisterStage1';
import RegisterStage2 from './components/RegisterStage2';
import RegisterStage3 from './components/RegisterStage3';
import RegisterStage4 from './components/RegisterStage4';
import AuthHeader from '@/components/sub/AuthHeader';
import { handleError } from '@/components/sub/ErrorToast';
import SimpleSpinLoader from '@/components/ui/simplespinloader';
import MainNavbar from '@/components/common/MainNavbar';

// Constants
const STAGE_COUNT = 4;
const FORM_STORAGE_KEY = 'registerFormData';

// Type Definitions
type Stage1FormData = { email: string };
type Stage2FormData = { firstName: string; lastName: string };
type Stage3FormData = { country: string; profession: string };
type Stage4FormData = { password: string; confirmPassword: string };
type FormData = Stage1FormData & Stage2FormData & Stage3FormData & Stage4FormData;

// Main RegisterPage Component
function RegisterPage() {
  const [stage, setStage] = useState(() => {
    const storedStage = localStorage.getItem('registerStage');
    return storedStage ? parseInt(storedStage, 10) : 1;
  });
  const [formData, setFormData] = useState<FormData>(() => {
    const storedData = localStorage.getItem(FORM_STORAGE_KEY);
    return storedData
      ? JSON.parse(storedData)
      : {
        email: '',
        firstName: '',
        lastName: '',
        country: '',
        profession: '',
        password: '',
        confirmPassword: '',
      };
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, userId } = useSelector((state: any) => state.auth);

  // Sync form data and stage to localStorage
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem('registerStage', stage.toString());
  }, [formData, stage]);

  // Redirect to verify email on successful registration
  useEffect(() => {
    if (userId && !error) {
      navigate('/verify-info');
      toast.success(successMessage || 'Verify your email to continue', {
        style: { background: '#1D1D1D', color: '#3CE7B2' },
      });
      dispatch(clearAuthInitialState());
      localStorage.setItem("state","VERIFY_EMAIL_REQUEST_FORCE_SENT")
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem('registerStage');
    }
  }, [userId, error, successMessage, navigate, dispatch]);

  // Clear auth state on mount
  useEffect(() => {
    dispatch(clearAuthInitialState());
  }, [dispatch]);

  // Stage transition handlers
  const handleStage1Submit = () => setStage(2);

  const handleStage2Submit = (data: Stage2FormData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStage(3);
  };

  const handleStage3Submit = (data: Stage3FormData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStage(4);
  };

  const handleStage4Submit = (data: Stage4FormData) => {
    const finalData = { ...formData, ...data };
    dispatch(registerUser(finalData) as any);
  };

  const goBack = () => {
    if (stage > 1) setStage(stage - 1);
  };

  // Progress calculation
  const progress = (stage / STAGE_COUNT) * 100;

  // Loader Overlay Component
  const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] bg-opacity-95 z-50 ">
      <SimpleSpinLoader className="w-12 h-12 text-[#3CE7B2]" />
      <div className="text-white text-xl opacity-80 mt-24">Creating your account</div>
      <button
        onClick={onCancel}
        className="text-gray-400 text-sm mt-4 underline hover:text-[#3CE7B2]"
      >
        Cancel
      </button>
    </div>
  );

  // Show error toast based on state
  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white relative ">
      {loading && <LoaderOverlay onCancel={() => { }} />}
      <div className="w-full bg-zinc-800 h-2">
        <div
          className="bg-green-500 h-2 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* <AuthHeader page="/login" name="Login" /> */}
      <MainNavbar />
      <div className="flex flex-col flex-1 items-center justify-center">
        {stage === 1 && (
          <SignupForm
            onNext={handleStage1Submit}
            setFormData={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            initialData={formData}
          />
        )}
        {stage === 2 && (
          <RegisterStage2
            email={formData.email}
            onNext={handleStage2Submit}
            onBack={goBack}
            setFormData={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            initialData={formData}
          />
        )}
        {stage === 3 && (
          <RegisterStage3
            email={formData.email}
            onNext={handleStage3Submit}
            onBack={goBack}
            setFormData={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            initialData={formData}
          />
        )}
        {stage === 4 && (
          <RegisterStage4
            email={formData.email}
            onBack={goBack}
            onSubmit={handleStage4Submit}
          />
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
