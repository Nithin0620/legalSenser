import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload as UploadIcon,
  Loader,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";

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
      setTimeout(() => navigate("/documents"), 1500);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen md:ml-64 flex items-center justify-center p-6 relative z-0">
      <div className="w-full max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/50 border border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600" />
          
          <div className="p-8 md:p-12">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black text-white mb-3">Upload Document</h1>
              <p className="text-slate-400">Our AI will extract and analyze your legal documents in seconds.</p>
            </div>

            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-xs">Success! Redirecting to library...</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-300"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
                <button onClick={clearError} className="ml-auto p-1 hover:bg-white/5 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Document Title</label>
                 <Input 
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="e.g. Employment Contract 2024"
                   className="bg-slate-800/50 border-white/10 h-14 rounded-xl text-white focus-visible:ring-blue-500/50"
                 />
               </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInput.current?.click()}
                className={cn(
                  "relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300",
                  dragActive 
                    ? "border-blue-500 bg-blue-500/5 scale-[1.02]" 
                    : "border-slate-800 bg-slate-800/20 hover:border-slate-700 hover:bg-slate-800/40",
                  file && "border-green-500/50 bg-green-500/5"
                )}
              >
                <input
                  ref={fileInput}
                  type="file"
                  onChange={handleChange}
                  accept=".pdf,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />
                
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file-selected"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{file.name}</p>
                        <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        Remove file
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-file"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <UploadIcon className="w-10 h-10 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-black text-xl mb-1">Drop your legal document here</p>
                        <p className="text-slate-500">Supports PDF, DOCX and Images (OCR enabled)</p>
                      </div>
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 h-12 font-bold transition-all">
                        Browse Files
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                disabled={!file || isLoading}
                className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:grayscale lg:mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader className="w-6 h-6 animate-spin" />
                    Processing Legal Text...
                  </div>
                ) : (
                  "Start AI Analysis"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-500">
           <div className="flex items-center gap-2">
             <Shield className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">Secure AES-256</span>
           </div>
           <div className="w-1 h-1 bg-slate-800 rounded-full" />
           <div className="flex items-center gap-2">
             <Brain className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">AI Extraction</span>
           </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Brain, Shield } from "lucide-react";
