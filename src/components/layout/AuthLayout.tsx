
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import SimpleHeader from "@/components/sub/AuthHeader";
import Footer from "@/components/Footer";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showHeader?: boolean;
  headerDestination?: string;
  headerButtonText?: string;
  fullHeight?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = true,
  headerDestination = "/signup",
  headerButtonText = "Sign Up",
  fullHeight = true,
}) => {
  return (
    <div className={`bg-[#121212] text-white ${fullHeight ? "min-h-screen" : ""} flex flex-col`}>
      {/* Green accent bar at top */}
      <div className="bg-[#3CE7B2] h-2 w-full" />
      
      {/* Header */}
      {showHeader && (
        <SimpleHeader page={headerDestination} name={headerButtonText} />
      )}
      
      {/* Main content */}
      <main className={`flex-grow pt-16 pb-16 ${!fullHeight ? "py-8" : ""}`}>
        <div className="max-w-md mx-auto px-4">
          {(title || subtitle) && (
            <div className="mb-8 text-center">
              {title && (
                <h1 className="text-3xl font-bold font-coinbase-display tracking-tight mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-gray-400 font-coinbase-sans">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          <div className="bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all duration-300">
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;
