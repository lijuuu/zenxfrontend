
import React from 'react';
import { Link } from 'react-router-dom';

const MainNavbar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="font-bold text-xl">ZenCode</Link>
        
        <div className="hidden md:flex items-center ml-8 space-x-4">
          <Link to="/problems" className="text-muted-foreground hover:text-foreground">Problems</Link>
          <Link to="/challenges" className="text-muted-foreground hover:text-foreground">Challenges</Link>
          <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground">Leaderboard</Link>
          <Link to="/compiler" className="text-muted-foreground hover:text-foreground">Compiler</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Link to="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link>
        <Link to="/settings" className="text-muted-foreground hover:text-foreground">Settings</Link>
      </div>
    </div>
  );
};

export default MainNavbar;
