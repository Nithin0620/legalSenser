import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Upload,
  MessageSquare,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Gavel,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Upload Document", href: "/upload" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat" },
  { icon: History, label: "History", href: "/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
            <div className="relative bg-slate-900 rounded-lg p-2">
              <Gavel className="w-5 h-5 text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              LegalSenser
            </h1>
            <p className="text-xs text-slate-500">AI Legal Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/10"
                    : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-900/50">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-slate-700/50 rounded-lg p-3 mb-3">
          <p className="text-xs text-slate-500 mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-slate-200 truncate">
            {user?.email || "User"}
          </p>
          {user?.name && (
            <p className="text-xs text-slate-400 truncate">{user.name}</p>
          )}
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden md:flex fixed left-0 top-0 z-50 w-64 h-screen flex-col"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Menu Button - shown by Navbar */}
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 z-40 w-64 h-screen flex-col md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Store the mobile menu state in a way Navbar can access it */}
      <div
        id="mobile-menu-toggle"
        style={{ display: "none", "--menu-open": mobileOpen ? "true" : "false" } as any}
      />
    </>
  );
}
