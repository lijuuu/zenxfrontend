
import React from 'react';
import { Link } from 'react-router-dom';

const MainNavbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md bg-black/80 z-50 border-b border-zinc-800/50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="text-green-500">zenx</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/problems" className="text-zinc-400 hover:text-white transition-colors">
            Problems
          </Link>
          <Link to="/challenges" className="text-zinc-400 hover:text-white transition-colors">
            Challenges
          </Link>
          <Link to="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">
            Leaderboard
          </Link>
          <Link to="/settings" className="text-zinc-400 hover:text-white transition-colors">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
