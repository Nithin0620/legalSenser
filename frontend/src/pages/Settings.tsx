import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            {/* Appearance */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>
              </div>
            </Card>

            {/* Language */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Language Preferences</h2>
              <div className="space-y-4">
                <div>
                  <Label>Default Summary Language</Label>
                  <Select defaultValue="english">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Account */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="alex@example.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    defaultValue="Alex Johnson"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
                Save Changes
              </Button>
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive" className="ml-auto">
                Logout
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
