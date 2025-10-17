import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    setUploading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUploading(false);
    setShowSummary(true);
    toast({
      title: "Document simplified!",
      description: "Your document has been processed successfully.",
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
            className="max-w-4xl mx-auto space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Upload Document</h1>
              <p className="text-muted-foreground">Upload a PDF or paste your document text</p>
            </div>

            {!showSummary ? (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 border-dashed border-2 border-primary/50 hover:border-primary transition-all">
                  <div className="text-center space-y-4">
                    <div className="inline-flex p-6 rounded-full bg-primary/10 text-primary">
                      <UploadIcon className="h-12 w-12" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Upload PDF</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your file here or click to browse
                      </p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Or Paste Text</h3>
                  <Textarea
                    placeholder="Paste your document text here..."
                    className="min-h-[300px] mb-4"
                  />
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-primary to-accent"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Simplify with AI"
                    )}
                  </Button>
                </Card>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-8 border-primary/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Document Summary</h2>
                      <p className="text-sm text-muted-foreground">Simplified version of your document</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Overview</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        This document outlines the privacy policy for the service. It explains how user data is collected,
                        stored, and used. The policy emphasizes user rights and data protection measures.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Key Points</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>User data is encrypted and stored securely</li>
                        <li>Personal information is never shared with third parties</li>
                        <li>Users can request data deletion at any time</li>
                        <li>Cookies are used to improve user experience</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Benefits</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        This policy ensures your data privacy and gives you control over your information. You can access,
                        modify, or delete your data anytime.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Your Obligations</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        You must provide accurate information and keep your account secure. Report any unauthorized access
                        immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                      Start Chat
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Translate
                    </Button>
                    <Button variant="outline" onClick={() => setShowSummary(false)}>
                      Upload New
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
