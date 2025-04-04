
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">
              <span className="text-green-500">zenx</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Elevate your coding skills through challenges
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link to="/about" className="text-sm text-zinc-400 hover:text-white">About</Link>
            <Link to="/terms" className="text-sm text-zinc-400 hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-sm text-zinc-400 hover:text-white">Privacy</Link>
            <Link to="/contact" className="text-sm text-zinc-400 hover:text-white">Contact</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} zenx. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
