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
  GitCompare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Upload Document", href: "/upload" },
  { icon: FileText, label: "Contracts", href: "/documents" },
  { icon: GitCompare, label: "Compare Versions", href: "/compare" },
  { icon: MessageSquare, label: "AI Copilot", href: "/chat" },
  { icon: History, label: "Audit History", href: "/history" },
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

  const isAuth = isAuthenticated || !!user || !!useAuthStore.getState().token;
  if (!isAuth) return null;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black border-r border-border/60">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-3 mb-1">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-75"></div>
            <div className="relative bg-card border border-amber-500/30 rounded-lg p-2">
              <Gavel className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              LegalSenser
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">AI Legal Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium",
                  isActive
                    ? "bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-md shadow-amber-500/10 font-bold"
                    : "text-muted-foreground hover:text-white hover:bg-card/80"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-amber-400" : "text-muted-foreground")} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border/60 bg-card/40">
        <div className="bg-card border border-border/60 rounded-xl p-3 mb-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Logged in as</p>
          <p className="text-xs font-semibold text-white truncate">
            {user?.email || "counsel@example.com"}
          </p>
          {user?.name && (
            <p className="text-[11px] text-amber-400/90 font-medium truncate mt-0.5">{user.name}</p>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
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

      {/* Mobile Floating Menu Button */}
      <div className="md:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-card border border-border/70 text-amber-400 shadow-xl backdrop-blur-md"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
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
    </>
  );
}
