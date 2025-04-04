
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-bold">
              <span className="text-green-500">zenx</span>
            </Link>
            <p className="text-xs text-zinc-500 mt-1">
              © {new Date().getFullYear()} Zenx. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <Link to="/terms" className="text-zinc-400 hover:text-white transition">
              Terms
            </Link>
            <Link to="/privacy" className="text-zinc-400 hover:text-white transition">
              Privacy
            </Link>
            <Link to="/help" className="text-zinc-400 hover:text-white transition">
              Help
            </Link>
            <a 
              href="https://github.com/zenx2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
