import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Trash2,
  Clock,
  Zap,
  Shield,
  Activity,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { AppLayout } from "@/components/AppLayout";

export default function History() {
  const { recentActivity, isLoading, fetchAllHistory } = useDocumentStore();

  useEffect(() => {
    fetchAllHistory();
  }, [fetchAllHistory]);

  const handleDeleteHistory = async (id: string) => {
    try {
      await api.delete(`/ai/history/${id}`);
      fetchAllHistory();
    } catch (err) {
      console.error("Failed to delete history item", err);
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "simplify": return <Zap className="w-4 h-4 text-amber-400" />;
      case "summarize": return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case "analyze-risk":
      case "risk": return <Shield className="w-4 h-4 text-amber-300" />;
      case "chat": return <MessageSquare className="w-4 h-4 text-amber-400" />;
      case "compare": return <Activity className="w-4 h-4 text-yellow-500" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-6 border-b border-border/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-2">
            <Clock className="w-3.5 h-3.5" />
            Compliance & Audit Ledger
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Audit & Analysis History</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Immutable log of all AI simplifications, risk radar scans, and copilot sessions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground font-medium">Retrieving audit records...</p>
          </div>
        ) : recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="bg-card border-border hover:border-amber-500/30 transition-all duration-200">
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="p-2.5 bg-black border border-border rounded-xl flex-shrink-0">
                        {getOperationIcon(item.operationType || item.activityType)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-bold text-white truncate">
                            {item.title || item.documentName || "AI Analysis Event"}
                          </h3>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold border-border text-amber-400/90 bg-black px-1.5 py-0">
                            {item.operationType || item.activityType || "Operation"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </p>
                        {item.document?.title && (
                          <p className="text-amber-400 text-xs font-semibold mt-1 truncate">
                            Document: {item.document.title}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={item.document?._id ? `/document/${item.document._id}` : "#"}>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border hover:border-amber-500/50 hover:bg-amber-500/10 text-white rounded-lg gap-1.5 font-semibold">
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteHistory(item._id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        title="Delete audit record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl p-6">
            <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No audit history records</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
              Your analysis ledger begins as soon as you upload a document or execute a risk scan.
            </p>
            <Link to="/upload">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black font-black rounded-xl h-10 px-5 text-xs">
                Upload Document Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
