import { Link, useLocation } from "react-router-dom";
import { Home, Upload, History, Settings, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Upload", href: "/upload" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: History, label: "History", href: "/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card"
    >
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent/50",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
