
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SimpleHeaderProps {
  showBackButton?: boolean;
  showLogo?: boolean;
  page?: string;
  name?: string;
}

const AuthHeader: React.FC<SimpleHeaderProps> = ({ 
  showBackButton = false,
  showLogo = true,
  page,
  name
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-zinc-400 hover:text-white transition-colors p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        
        {showLogo && (
          <div className="font-bold text-xl text-white">ZenX</div>
        )}
      </div>
    </div>
  );
};

export default AuthHeader;
