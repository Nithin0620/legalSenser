import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Trash2,
  Loader,
  AlertCircle,
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/AppLayout";

export default function Documents() {
  const { documents, isLoading, error, fetchDocuments, deleteDocument } = useDocumentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.documentType && doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType =
      typeFilter === "all" ||
      (doc.documentType && doc.documentType.toLowerCase() === typeFilter.toLowerCase());
    return matchesQuery && matchesType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Contract Knowledge Base
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Contract Library</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Securely indexed repositories, clause extractions, and version controls.
            </p>
          </div>
          <Link to="/upload">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black h-10 px-5 rounded-xl font-black shadow-md shadow-amber-500/20 gap-2">
              <Plus className="w-4 h-4" />
              Upload Contract
            </Button>
          </Link>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts by title, keyword, or counterparty..."
              className="pl-10 h-11 bg-card border-border rounded-xl text-white placeholder:text-muted-foreground/50 text-sm focus-visible:ring-amber-500/40"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["all", "contract", "nda", "employment", "lease"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                  typeFilter === type
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-500/20 font-black"
                    : "bg-card text-muted-foreground border border-border hover:text-white hover:bg-black"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-destructive font-semibold text-sm">Synchronizing issue</p>
              <p className="text-destructive/80 text-xs mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-xs text-muted-foreground font-medium animate-pulse">
              Synchronizing contract library...
            </p>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc._id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group relative"
              >
                <Card className="bg-card border-border backdrop-blur-md relative overflow-hidden hover:border-amber-500/50 transition-all duration-300 shadow-sm flex flex-col justify-between h-full">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold border-border text-amber-400/90 uppercase tracking-wider bg-black px-2 py-0.5">
                        {doc.documentType || "Contract"}
                      </Badge>
                    </div>

                    <Link to={`/document/${doc._id}`}>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                        {doc.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        doc.lastProcessedAt ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-muted shadow-none"
                      )} />
                      <span className="text-muted-foreground text-xs font-medium">
                        {doc.lastProcessedAt ? "AI Audited & Indexed" : "Ready for Analysis"}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-black border-t border-border flex items-center justify-between gap-2">
                    <Link to={`/document/${doc._id}`} className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                      Open Analysis
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg"
                        title="Download text"
                        onClick={(e) => {
                          e.preventDefault();
                          const content = (doc as any).originalText || `Title: ${doc.title}\nType: ${doc.documentType}\nUploaded: ${doc.uploadedAt}`;
                          const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${doc.title || "document"}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        title="Delete document"
                        onClick={(e) => {
                          e.preventDefault();
                          if (window.confirm("Are you sure you want to delete this contract?")) {
                            deleteDocument(doc._id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl p-6">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              {searchQuery ? "No matching contracts found" : "Your contract library is empty"}
            </h3>
            <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchQuery
                ? "Try searching with a different term or clear the filter."
                : "Upload your first legal document to begin AI risk auditing and clause translation."}
            </p>
            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                }}
                className="border-border text-xs"
              >
                Clear Search Filter
              </Button>
            ) : (
              <Link to="/upload">
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black font-black rounded-xl h-10 px-5 text-xs">
                  Upload First Contract
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
