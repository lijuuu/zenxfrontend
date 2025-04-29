
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminAuthenticated, adminLogout } from "@/utils/authUtils";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated as admin
    if (!isAdminAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    // Check for mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative z-20 flex flex-col w-64 h-screen px-4 py-8 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-white">Admin</span>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex flex-col flex-1 mt-10">
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-6 text-left text-base hover:bg-zinc-800"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </nav>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-6 text-left text-red-400 hover:bg-zinc-800 hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        {isMobile && (
          <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 md:hidden">
            <span className="text-xl font-semibold">Admin</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-950">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
