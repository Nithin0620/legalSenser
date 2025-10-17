import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Upload, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const recentDocs = [
  {
    id: 1,
    title: "Privacy Policy Update",
    date: "2 hours ago",
    status: "Simplified",
  },
  {
    id: 2,
    title: "Terms of Service",
    date: "1 day ago",
    status: "In Progress",
  },
  {
    id: 3,
    title: "GDPR Compliance Doc",
    date: "3 days ago",
    status: "Simplified",
  },
];

const stats = [
  { label: "Documents Processed", value: "24", icon: FileText },
  { label: "Summaries Generated", value: "24", icon: TrendingUp },
  { label: "Words Simplified", value: "15.2K", icon: MessageSquare },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Alex 👋</h1>
              <p className="text-muted-foreground">Here's what's happening with your documents</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg hover:shadow-primary/10 transition-all border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Documents */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Documents</h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="grid gap-4">
                {recentDocs.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg hover:shadow-primary/10 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{doc.title}</h3>
                            <p className="text-sm text-muted-foreground">{doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              doc.status === "Simplified"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {doc.status}
                          </span>
                          <Button variant="ghost" size="sm">View Summary</Button>
                          <Button variant="ghost" size="sm">Chat</Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-primary/20">
                  <MessageSquare className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Recent Chats</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Continue your conversations about uploaded documents
                  </p>
                  <Button variant="outline" className="w-full">View Chats</Button>
                </Card>
                <Card className="p-6 border-primary/20">
                  <Upload className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Upload New Document</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a new policy or legal document to simplify
                  </p>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent">
                    Upload Now
                  </Button>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Floating Upload Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-8 right-8"
          >
            <Button
              size="lg"
              className="rounded-full h-16 w-16 shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/50 animate-glow-pulse"
            >
              <Upload className="h-6 w-6" />
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
