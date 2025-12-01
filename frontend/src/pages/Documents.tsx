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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 md:ml-64 md:pt-0 pt-20">
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Documents</h1>
            <p className="text-slate-400">Manage your uploaded legal documents</p>
          </div>
          <Link to="/upload">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Upload New
            </Button>
          </Link>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-all"
              >
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{doc.filename}</h3>
                  <p className="text-slate-400 text-sm">Type: {doc.type || "document"}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(doc.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-4">No documents uploaded yet</p>
            <Link to="/upload">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                Upload Your First Document
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
