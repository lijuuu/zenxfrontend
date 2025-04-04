
import React from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '@/components/sub/AuthHeader';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  showLogo = true,
  showBackButton = false,
  className = '',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 auth-page">
      <div className={`w-full max-w-md bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-lg shadow-xl overflow-hidden ${className}`}>
        <AuthHeader showLogo={showLogo} showBackButton={showBackButton} />
        
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {description && (
              <p className="mt-1 text-zinc-400 text-sm">{description}</p>
            )}
          </div>
          
          {children}
        </div>
        
        <div className="border-t border-zinc-800/50 bg-zinc-900/20 px-6 py-4">
          <div className="text-center text-sm text-zinc-500">
            <div className="flex items-center justify-center gap-1">
              <span>&copy; {new Date().getFullYear()}</span>
              <Link 
                to="/"
                className="font-medium text-zinc-400 hover:text-white transition-colors"
              >
                ZenX
              </Link>
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
