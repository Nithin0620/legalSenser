import { Link, useLocation } from "react-router-dom";
import { Gavel, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-card border border-amber-500/30 rounded-lg p-2">
              <Gavel className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              LegalSenser
            </span>
            <span className="text-[10px] text-amber-400/80 font-semibold tracking-widest uppercase -mt-1">
              AI Legal Platform
            </span>
          </div>
        </Link>

        {isLanding && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-amber-400 transition-colors">Live Demo</a>
            <a href="#security" className="hover:text-amber-400 transition-colors">Security</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isLanding ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-lg px-5 shadow-lg shadow-amber-500/20 gap-1.5 transition-all hover:scale-105 active:scale-95">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black font-bold rounded-lg shadow-md shadow-amber-500/20">
                Go to Workspace
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
