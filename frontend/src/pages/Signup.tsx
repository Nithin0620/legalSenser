import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, Loader, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function Signup() {
  const navigate = useNavigate();
  const { sendOtp, signupWithOtp, error, isLoading, clearError } = useAuthStore();

  const [step, setStep] = useState<"register" | "otp">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const validateRegisterForm = () => {
    if (!name.trim()) {
      setLocalError("Full name is required");
      return false;
    }
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Please enter a valid email");
      return false;
    }
    if (!password.trim()) {
      setLocalError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!validateRegisterForm()) return;

    try {
      await sendOtp(email);
      setStep("otp");
    } catch (err) {
      setLocalError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!otp.trim()) {
      setLocalError("OTP is required");
      return;
    }

    try {
      const success = await signupWithOtp({
        email,
        name,
        password,
        otp,
      });
      if (success) {
        navigate("/login", { state: { message: "Account created! Please login with your credentials." } });
      }
    } catch (err) {
      setLocalError("Failed to create account. Please check your OTP and try again.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-0">
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
                  <UserPlus className="w-7 h-7 text-amber-400" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-1">
              LegalSenser
            </h1>
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              {step === "register" ? "Create your counsel account" : "Verify your email address"}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            <motion.div
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                step === "register" ? "bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm shadow-amber-500/50" : "bg-muted"
              }`}
            />
            <motion.div
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                step === "otp" ? "bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm shadow-amber-500/50" : "bg-muted"
              }`}
            />
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

          {/* Step 1: Register Form */}
          <form onSubmit={handleSendOtp} className={step === "register" ? "space-y-4" : "hidden"}>
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="Senior Counsel"
                  className="pl-10 bg-black border-border text-white placeholder:text-muted-foreground/40 focus:border-amber-400 h-11 rounded-xl text-sm"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
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
              transition={{ delay: 0.25 }}
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
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
                  className="w-full pl-10 pr-10 py-2.5 bg-black border border-border rounded-xl text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50 text-sm h-11"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-black border border-border rounded-xl text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50 text-sm h-11"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold h-11 rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-black" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-black" />
                    Continue
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Step 2: OTP Form */}
          <form onSubmit={handleVerifyOtp} className={step === "otp" ? "space-y-4" : "hidden"}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-6"
            >
              <p className="text-muted-foreground text-sm mb-1">We've sent a 6-digit verification code to</p>
              <p className="text-amber-400 font-bold">{email}</p>
            </motion.div>

            {/* OTP Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setLocalError("");
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 bg-black border border-border focus:border-amber-400 rounded-xl text-white text-center text-3xl font-mono tracking-widest placeholder:text-muted-foreground/30 focus:outline-none transition-colors disabled:opacity-50"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">Enter the code sent to your inbox</p>
            </motion.div>

            {/* Verify Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold h-11 rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-black" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    Verify & Create Account
                  </>
                )}
              </Button>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="button"
                onClick={() => {
                  setStep("register");
                  setOtp("");
                }}
                className="w-full py-2 text-muted-foreground hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors mt-2"
              >
                ← Back to registration
              </button>
            </motion.div>
          </form>

          {/* Sign In Link */}
          {step === "register" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 pt-6 border-t border-border text-center text-muted-foreground text-xs"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold transition-colors ml-1">
                Sign in here
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
