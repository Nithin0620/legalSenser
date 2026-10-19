import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "@/store/authStore";
import { Link, useLocation } from "react-router-dom";
import {
  Upload,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "./ui/button";

import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  noPadding?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function AppLayout({
  children,
  title,
  subtitle,
  actions,
  noPadding = false,
  fullWidth = false,
  className,
}: AppLayoutProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  const getBreadcrumbName = (pathname: string) => {
    if (pathname.startsWith("/document/")) return "Document Analysis";
    if (pathname.startsWith("/chat/")) return "Document Copilot";
    switch (pathname) {
      case "/dashboard": return "Dashboard";
      case "/upload": return "New Document Analysis";
      case "/documents": return "Contract Library";
      case "/compare": return "Version Comparison";
      case "/chat": return "Legal Copilot";
      case "/history": return "Audit History";
      case "/settings": return "Settings & Profile";
      default: return "Workspace";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      {/* Persistent SaaS Sidebar */}
      <Sidebar />

      {/* Main Content Area with unified responsive margin */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
            <span className="font-medium text-foreground/80 hover:text-foreground transition-colors">LegalSenser</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted-foreground/60" />
            <span className="font-semibold text-primary truncate">{getBreadcrumbName(location.pathname)}</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Engine Active</span>
            </div>

            {location.pathname !== "/upload" && (
              <Link to="/upload">
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black rounded-lg h-9 px-3.5 gap-1.5 shadow-md shadow-amber-500/20 font-bold">
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload Contract</span>
                </Button>
              </Link>
            )}

            <Link to="/settings" className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-card border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400 shadow-inner">
                {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4 text-amber-400" />}
              </div>
            </Link>
          </div>
        </header>

        {/* Optional Page Subheader */}
        {(title || subtitle || actions) && (
          <div className="px-6 md:px-8 pt-8 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {title && <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>}
              {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}

        {/* Main Body */}
        <main
          className={cn(
            "flex-1 w-full",
            !fullWidth && "max-w-7xl mx-auto",
            !noPadding && "p-6 md:p-8",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
