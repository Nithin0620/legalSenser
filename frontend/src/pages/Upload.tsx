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
  const [docType, setDocType] = useState("contract");
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
      setFile(e.dataTransfer.files[0]);
      clearError();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await uploadDocument(file, docType);
      setUploadSuccess(true);
      setTimeout(() => navigate("/documents"), 2000);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 md:ml-64 md:pt-0 pt-20">
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Upload Document</h1>
        <p className="text-slate-400 mb-8">Upload legal documents to analyze with AI</p>

        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
            ✓ Document uploaded successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive ? "border-blue-500/50 bg-blue-500/10" : "border-slate-600/50 bg-slate-800/30"
            }`}
          >
            <input
              ref={fileInput}
              type="file"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <UploadIcon className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white font-semibold">{file ? file.name : "Drag to upload"}</p>
                <p className="text-slate-400 text-sm">or click to browse</p>
              </div>
              {!file && (
                <Button onClick={() => fileInput.current?.click()} className="bg-blue-600 text-white">
                  Choose File
                </Button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Document Type</label>
            <div className="grid grid-cols-3 gap-2">
              {["contract", "agreement", "policy"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDocType(type)}
                  className={`py-2 px-3 rounded font-medium ${
                    docType === type ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!file || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 font-medium"
          >
            {isLoading ? "Uploading..." : "Upload Document"}
          </Button>
        </form>
      </div>
    </div>
  );
}
