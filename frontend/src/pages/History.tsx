import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const documents = [
  { id: 1, title: "Privacy Policy Update", date: "2024-01-15", size: "124 KB" },
  { id: 2, title: "Terms of Service", date: "2024-01-14", size: "89 KB" },
  { id: 3, title: "GDPR Compliance Document", date: "2024-01-12", size: "256 KB" },
  { id: 4, title: "Cookie Policy", date: "2024-01-10", size: "45 KB" },
  { id: 5, title: "User Agreement", date: "2024-01-08", size: "178 KB" },
  { id: 6, title: "Data Processing Agreement", date: "2024-01-05", size: "203 KB" },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-4xl font-bold mb-2">Document History</h1>
              <p className="text-muted-foreground">View and manage all your uploaded documents</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="pl-10"
              />
            </div>

            {/* Documents Grid */}
            <div className="grid gap-4">
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg hover:shadow-primary/10 transition-all border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{doc.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{doc.date}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View Summary</Button>
                        <Button variant="outline" size="sm">Open Chat</Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredDocs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No documents found</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
