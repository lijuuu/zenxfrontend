import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Code,
  Terminal,
  Zap,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  Flag
} from "lucide-react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "@/store/slices/authSlice";
import { isAuthenticated } from "@/utils/authUtils";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
  requiresAuth?: boolean;
}

interface MainNavbarProps {
  isAuthenticated?: boolean;
}

const MainNavbar = ({ isAuthenticated: propIsAuthenticated }: MainNavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Determine authentication from cookies or props
  const authFromCookie = isAuthenticated();
  const effectiveIsAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : authFromCookie;

  // Get user profile from Redux store
  const { userProfile } = useSelector((state: any) => state.auth) || {};

  console.log(userProfile)

  useEffect(() => {
    // Fetch user profile if authenticated and not already loaded
    if (effectiveIsAuthenticated && !userProfile) {
      dispatch(getUser() as any);
    }
  }, [effectiveIsAuthenticated, userProfile, dispatch]);

  const navItems: NavItem[] = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" />,requiresAuth:false },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, requiresAuth: true },
    { name: "Profile", path: "/profile", icon: <User className="h-4 w-4" />, requiresAuth: true },
    { name: "Problems", path: "/problems", icon: <Code className="h-4 w-4" /> },
    { name: "Compiler", path: "/compiler", icon: <Terminal className="h-4 w-4" /> },
    { name: "Challenges", path: "/challenges", icon: <Zap className="h-4 w-4" />, isHighlighted: true },
    { name: "Leaderboard", path: "/leaderboard", icon: <Award className="h-4 w-4" /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare className="h-4 w-4" />, requiresAuth: true },
    { name: "Settings", path: "/settings", icon: <Settings className="h-4 w-4" />, requiresAuth: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAuth || (item.requiresAuth && effectiveIsAuthenticated)
  );


  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("auth");
    navigate("/login");
  };

  // Generate avatar fallback from user profile
  const getAvatarFallback = () => {
    if (userProfile) {
      return `${userProfile.firstName?.charAt(0) || ''}${userProfile.lastName?.charAt(0) || ''}` || 'U';
    }
    return 'U';
  };


  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 ease-in-out bg-zinc-900 border-b border-zinc-800"
      )}
    >
      <div className="page-container h-full flex items-center justify-between z-10">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 mr-8">
            <span
              className="text-2xl lowercase font-bold font-display tracking-tight relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-clip-text text-transparent animate-glow"
            >
              zenx
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {filteredNavItems.map((item) => {
              const isActiveRoute = isActive(item.path);
              return (
                <Button
                  key={item.path}
                  asChild
                  variant="ghost"
                  size={isMobile ? "lg" : "default"}
                  className={cn(
                    "gap-2 font-medium",
                    isActiveRoute
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                    item.isHighlighted && !isActiveRoute && "bg-green-500/5 text-green-500 hover:bg-green-500/10 hover:text-green-500",
                    item.isHighlighted && isActiveRoute && "bg-green-500 text-white hover:bg-green-500/90"
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" className="text-zinc-400 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>

          {effectiveIsAuthenticated && userProfile ? (
            <>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="text-zinc-400 hover:text-white relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userProfile.avatarURL || "https://i.pravatar.cc/300?img=1"}
                        alt={userProfile.firstName || "User"}
                      />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim().toLowerCase() || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userProfile.email || ""}
                      </p>
                      {userProfile.country && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Flag className="h-3 w-3 mr-1" />
                          <span>{userProfile.country}</span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-green-500 rounded-md text-sm font-medium transition-colors text-white hidden lg:block"
            >
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-zinc-400 hover:text-white"
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

      {/* Mobile Navigation */}
      <div
        className={cn(
          "xl:hidden fixed inset-y-0 right-0 z-40 transition-transform duration-300 ease-in-out bg-zinc-900",
          mobileMenuOpen ? "translate-x-0 w-[85%]" : "translate-x-full w-[85%]"
        )}
      >
        <nav className="py-6 px-4 space-y-1 min-h-screen overflow-y-auto">
          {effectiveIsAuthenticated && userProfile && (
            <div className="p-4 mb-4 border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={userProfile.avatarURL || "https://i.pravatar.cc/300?img=1"}
                    alt={userProfile.firstName || "User"}
                  />
                  <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {`${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || "User"}
                  </p>
                  <p className="text-xs text-zinc-400">{userProfile.email || ""}</p>
                </div>
              </div>
            </div>
          )}

          {filteredNavItems.map((item) => {
            const isActiveRoute = isActive(item.path);
            return (
              <Button
                key={item.path}
                asChild
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start gap-3 font-medium",
                  isActiveRoute
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                  item.isHighlighted && !isActiveRoute && "bg-green-500/5 text-green-500 hover:bg-green-500/10 hover:text-green-500",
                  item.isHighlighted && isActiveRoute && "bg-green-500 text-white hover:bg-green-500/90"
                )}
              >
                <Link to={item.path} className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            );
          })}

          <div className="pt-4 border-t border-zinc-800 mt-4">
            {effectiveIsAuthenticated ? (
              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-start gap-3 font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  Logout
                </div>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-start gap-3 font-medium bg-green-500 text-white hover:bg-green-600"
              >
                <Link to="/login" className="flex items-center gap-3">
                  Login
                </Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;