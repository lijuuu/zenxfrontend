
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import {
  Code,
  Trophy,
  Users,
  Puzzle,
  MessageSquare,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Home,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationsPopover from './common/NotificationsPopover';

const MainNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const userProfile = useAppSelector((state) => state.auth.userProfile);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { to: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { to: '/problems', label: 'Problems', icon: <Puzzle className="h-4 w-4" /> },
    { to: '/challenges', label: 'Challenges', icon: <Code className="h-4 w-4" /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy className="h-4 w-4" /> },
    { to: '/social', label: 'Social', icon: <Users className="h-4 w-4" /> },
    { to: '/messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-xl"
          >
            <span className="text-green-500">zenx</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-green-500/10 text-green-500"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
                  }`
                }
              >
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <NotificationsPopover />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.avatarURL} alt={userProfile?.userName || "User"} />
                    <AvatarFallback className="bg-green-500/10 text-green-500">
                      {userProfile?.userName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{userProfile?.userName}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${userProfile?.userID}`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/logout" className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden py-4 px-4 border-t border-zinc-800">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-green-500/10 text-green-500"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            <div className="pt-2 mt-2 border-t border-zinc-800">
              <Link
                to={`/profile/${userProfile?.userID}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-md transition-colors flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-md transition-colors flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                to="/logout"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-md transition-colors flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default MainNavbar;
