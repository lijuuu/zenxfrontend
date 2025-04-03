
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Problems", href: "/problems" },
    { name: "Features", href: "/#features" },
    { name: "About", href: "/#about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-zinc-200/70 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="page-container">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
              z
            </div>
            <span className="text-2xl lowercase font-bold font-display tracking-tight">
              zenx
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200",
                  "after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-green-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
                  "hover:text-green-500 hover:after:scale-x-100",
                  location.pathname === item.href || 
                  (location.pathname === "/" && item.href.startsWith("/#"))
                    ? "text-green-500 after:scale-x-100"
                    : "text-zinc-800"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <Link
              to="/login"
              className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium transition-colors"
            >
              Login
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="p-2 rounded-md text-zinc-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-24 px-6 flex flex-col transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-lg font-medium py-2 border-b border-zinc-100 transition-colors duration-200",
                location.pathname === item.href
                  ? "text-green-500 border-green-500"
                  : "text-zinc-800"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          <Link
            to="/login"
            className="mt-4 w-full py-3 bg-green-500 text-white rounded-md text-center font-medium transition-colors"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
