import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleLogin } from "@react-oauth/google";
import { AnimatedBackground } from "@/components/AnimatedBackground";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isGoogleConfigured = Boolean(
  googleClientId &&
  googleClientId.trim() !== "" &&
  googleClientId !== "your_google_client_id_here"
);

interface GoogleButtonProps {
  isLoading: boolean;
  setLocalError: (msg: string) => void;
}

const ActiveGoogleLoginButton = ({ isLoading, setLocalError }: GoogleButtonProps) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const responseGoogle = async (authResult: any) => {
    try {
      if (authResult?.code) {
        setIsGoogleLoading(true);
        await loginWithGoogle(authResult.code);
        navigate("/dashboard");
      } else {
        console.error("Google Auth response:", authResult);
        setLocalError("Google sign-in was not authorized or was canceled.");
      }
    } catch (e: any) {
      console.error("Error while Google Login:", e);
      setLocalError(e?.response?.data?.message || e?.message || "Error during Google authentication.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isLoading || isGoogleLoading}
      className="w-full flex items-center justify-center gap-2 bg-black hover:bg-white/5 border border-border text-white font-semibold py-2.5 h-11 rounded-xl transition-all duration-200 text-xs disabled:opacity-50"
    >
      {isGoogleLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin text-amber-400" />
          Signing in with Google...
        </>
      ) : (
        <>
          <GoogleIcon />
          Continue with Google
        </>
      )}
    </button>
  );
};

const FallbackGoogleLoginButton = ({ setLocalError }: { setLocalError: (msg: string) => void }) => (
  <button
    type="button"
    onClick={() => {
      setLocalError("Google OAuth is not configured. Please sign in with email & password or provide VITE_GOOGLE_CLIENT_ID in your environment.");
    }}
    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-white/5 border border-border/70 text-muted-foreground font-semibold py-2.5 h-11 rounded-xl transition-all duration-200 text-xs"
  >
    <GoogleIcon />
    Continue with Google
  </button>
);

export default function Login() {
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!password.trim()) {
      setLocalError("Password is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!validateForm()) return;

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setLocalError("Login failed. Please check credentials and try again.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-0 bg-black">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card border border-border rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-75"></div>
                <div className="relative bg-black border border-amber-500/30 rounded-lg p-3">
                  <LogIn className="w-7 h-7 text-amber-400" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-1">
              LegalSenser
            </h1>
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">AI Legal Intelligence Platform</p>
          </div>

          {/* Error Alert */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{displayError}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="counsel@firm.com"
                  className="pl-10 bg-black border-border text-white placeholder:text-muted-foreground/40 focus:border-amber-400 h-11 rounded-xl text-sm"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-black border border-border rounded-xl text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-400 text-sm transition-colors disabled:opacity-50"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="pt-2"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black py-2.5 h-11 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-black" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In to Workspace
                  </>
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground uppercase font-bold tracking-wider">or</span>
              </div>
            </div>

            {/* Google Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              {isGoogleConfigured ? (
                <ActiveGoogleLoginButton
                  isLoading={isLoading}
                  setLocalError={setLocalError}
                />
              ) : (
                <FallbackGoogleLoginButton
                  setLocalError={setLocalError}
                />
              )}
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <p className="text-center text-muted-foreground text-xs">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </motion.div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
            <p>Demo credentials: test@example.com / password123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
