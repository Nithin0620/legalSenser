import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleLogin } from "@react-oauth/google";


// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, error, isLoading, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      const success = await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError("Login failed. Please try again.");
    }
  };



  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await loginWithGoogle(authResult.code);
       navigate('/dashboard');
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log('Error while Google Login...', e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-slate-900 rounded-lg p-3">
                  <LogIn className="w-8 h-8 text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              LegalSenser
            </h1>
            <p className="text-slate-400 text-sm">AI-Powered Legal Document Assistant</p>
          </div>

          {/* Error Alert */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{displayError}</p>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="you@example.com"
                  className="pl-10 bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">or</span>
              </div>
            </div>

            {/* Google Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <button
                type="button"
                onClick={googleLogin}
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-100 font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-center text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </motion.div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-xs text-slate-500">
            <p>Demo credentials: test@example.com / password123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
