import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative z-0">
      <AnimatedBackground />
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 backdrop-blur-xl text-center">
        <div className="inline-block relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl blur opacity-75"></div>
          <div className="relative bg-black border border-amber-500/30 rounded-2xl p-4">
            <FileQuestion className="w-10 h-10 text-amber-400" />
          </div>
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold text-white mb-2">Clause Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">
          The legal document or route you are attempting to access does not exist in this jurisdiction.
        </p>
        <Button
          asChild
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold h-11 rounded-xl shadow-lg shadow-amber-500/10"
        >
          <Link to="/" className="inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4 text-black" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

