import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { AppLayout } from "@/components/AppLayout";
import { User, Shield, Moon, Globe, LogOut, Check, Sparkles } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/profile", { name });
      toast({
        title: "Settings saved!",
        description: "Your preferences and profile have been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Failed to update profile",
        description: err.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl space-y-6"
      >
        <div className="pb-6 border-b border-border/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-2">
            <User className="w-3.5 h-3.5" />
            Account & Workspace Preferences
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Settings & Profile</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your credentials, theme configuration, and AI model defaults.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-card border-border backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <User className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Profile Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Attorney Name or Organization"
                className="mt-1.5 bg-black border-border text-white h-11 rounded-xl text-sm focus-visible:ring-amber-500/40"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                disabled
                value={email}
                className="mt-1.5 bg-black/50 border-border text-muted-foreground h-11 rounded-xl text-sm cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Your email address is managed via your secure identity provider.
              </p>
            </div>
          </div>
        </Card>

        {/* AI & Language Configuration */}
        <Card className="bg-card border-border backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Globe className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Language & Regional Defaults</h2>
          </div>

          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Default Simplification Language
            </Label>
            <Select defaultValue="english">
              <SelectTrigger className="mt-1.5 bg-black border-border text-white h-11 rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-white text-sm">
                <SelectItem value="english">English (US / UK / Common Law)</SelectItem>
                <SelectItem value="hindi">Hindi (Indian Legal System)</SelectItem>
                <SelectItem value="spanish">Spanish (Civil Law)</SelectItem>
                <SelectItem value="french">French (Code Civil)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground mt-1">
              AI analysis will format executive summaries and plain English outputs in this language.
            </p>
          </div>
        </Card>

        {/* Security & Theme */}
        <Card className="bg-card border-border backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Moon className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Display Preferences</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-semibold text-white">High-Contrast Dark Theme</Label>
              <p className="text-xs text-muted-foreground">
                Pitch-black interface with gold accents tailored for reading long legal contracts
              </p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </Card>

        {/* Save / Logout Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black h-10 px-6 rounded-xl font-black shadow-md shadow-amber-500/20 text-xs"
            >
              {isSaving ? "Saving Settings..." : "Save Preferences"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="h-10 px-4 rounded-xl border-border text-xs hover:border-amber-500/40"
            >
              Cancel
            </Button>
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="h-10 px-4 rounded-xl text-xs gap-1.5 font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </motion.div>
    </AppLayout>
  );
}
