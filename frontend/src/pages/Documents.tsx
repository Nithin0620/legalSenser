import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Download, Trash2, Loader, AlertCircle } from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";

export default function Documents() {
  const { documents, isLoading, error, fetchDocuments, deleteDocument } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="min-h-screen md:ml-64 relative z-0">
      <div className="p-6 md:p-8 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              My Documents
            </h1>
            <p className="text-slate-400 text-lg">Manage and analyze your legal repository</p>
          </div>
          <Link to="/upload">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-8 rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5 mr-2" />
              Upload New Document
            </Button>
          </Link>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4"
          >
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            </div>
            <div>
              <p className="text-red-300 font-medium">Something went wrong</p>
              <p className="text-red-400/80 text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
              <Loader className="w-12 h-12 text-blue-500 animate-spin relative" />
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Synchronizing your library...</p>
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm relative overflow-hidden hover:border-blue-500/30 transition-all cursor-pointer">
                  <Link to={`/document/${doc._id}`}>
                    <CardHeader className="pb-2">
                       <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                           <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                         </div>
                         <Badge variant="outline" className="text-xs border-white/10 text-slate-400 capitalize bg-slate-800/50">
                           {doc.documentType}
                         </Badge>
                       </div>
                       <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors truncate">
                         {doc.title}
                       </CardTitle>
                       <CardDescription className="text-slate-500 flex items-center gap-2 mt-1">
                         <Calendar className="w-3 h-3" />
                         {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                       </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[2px] w-full bg-white/5 mb-4" />
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className={cn(
                             "w-2 h-2 rounded-full shadow-[0_0_8px]",
                             doc.lastProcessedAt ? "bg-green-500 shadow-green-500/50" : "bg-slate-600 shadow-slate-600/50"
                           )} />
                           <span className="text-xs font-semibold text-slate-400">
                             {doc.lastProcessedAt ? "Analyzed" : "New"}
                           </span>
                         </div>
                         <div className="flex gap-2">
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/5 rounded-full"
                             onClick={(e) => {
                               e.preventDefault();
                               // Download logic
                             }}
                           >
                             <Download className="w-4 h-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full"
                             onClick={(e) => {
                               e.preventDefault();
                               deleteDocument(doc._id);
                             }}
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-900/30 border border-dashed border-white/5 rounded-3xl">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative bg-slate-800 rounded-3xl p-6 flex items-center justify-center">
                <FileText className="w-12 h-12 text-slate-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Your library is empty</h3>
            <p className="text-slate-500 text-lg mb-8 max-w-sm mx-auto">
              Upload your first legal document or contract to start your AI-powered analysis.
            </p>
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 px-10 h-16 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/20">
                Upload My First Document
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
