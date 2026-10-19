import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload as UploadIcon,
  Loader,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Brain,
  Shield,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/AppLayout";

export default function Upload() {
  const navigate = useNavigate();
  const { uploadDocument, isLoading, error, clearError } = useDocumentStore();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!title) setTitle(droppedFile.name.split('.')[0]);
      clearError();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) setTitle(selectedFile.name.split('.')[0]);
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await uploadDocument(file, title);
      setUploadSuccess(true);
      setTimeout(() => navigate("/documents"), 1200);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative"
        >
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
          
          <div className="p-8 md:p-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                OCR & Natural Language Clause Parser
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Upload Legal Document</h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
                Securely ingest agreements, contracts, or terms. Our microservice decomposes clauses, flags risks, and extracts definitions.
              </p>
            </div>

            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-amber-300"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">Contract uploaded successfully!</p>
                  <p className="text-xs text-amber-400/80">Redirecting to your contract repository...</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-center gap-3 text-destructive"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{error}</span>
                <button onClick={clearError} className="p-1 hover:bg-white/10 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                  Contract / Agreement Title
                </label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Services Agreement v2"
                  className="bg-black border-border h-12 rounded-xl text-white placeholder:text-muted-foreground/50 focus-visible:ring-amber-500/40 text-sm"
                />
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInput.current?.click()}
                className={cn(
                  "relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300",
                  dragActive 
                    ? "border-amber-400 bg-amber-500/10 scale-[1.01]" 
                    : "border-border bg-black/60 hover:border-amber-500/50 hover:bg-black/80",
                  file && "border-amber-500/60 bg-amber-500/5"
                )}
              >
                <input
                  ref={fileInput}
                  type="file"
                  onChange={handleChange}
                  accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                />
                
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file-selected"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
                        <FileCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-base">{file.name}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for ingestion
                        </p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-3"
                      >
                        Select a different file
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-file"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-200">
                        <UploadIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg mb-1">Click to browse or drop file here</p>
                        <p className="text-muted-foreground text-xs">Supports PDF, DOCX, TXT, and scanned image formats</p>
                      </div>
                      <span className="inline-flex items-center text-xs font-bold text-amber-400 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        Select Document
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                disabled={!file || isLoading}
                className="w-full h-13 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black rounded-xl font-black text-base shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:grayscale"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2.5">
                    <Loader className="w-5 h-5 animate-spin text-black" />
                    Extracting & Indexing Legal Document...
                  </div>
                ) : (
                  "Execute AI Analysis"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
        
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="w-1 h-1 bg-border rounded-full" />
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-yellow-400" />
            <span>Semantic Clause Tagging</span>
          </div>
          <div className="w-1 h-1 bg-border rounded-full" />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Zero Data Retention for Training</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
