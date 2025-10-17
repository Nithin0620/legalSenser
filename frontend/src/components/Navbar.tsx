import { Link, useLocation } from "react-router-dom";
import { Brain } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Brain className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CivicAI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isLanding ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
