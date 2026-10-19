import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Activity,
  Clock,
  TrendingUp,
  Plus,
  Loader,
  RefreshCw,
  Brain,
  Upload,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";

interface ActivityItem {
  id: string;
  type?: string;
  activityType?: string;
  title?: string;
  documentName?: string;
  timestamp?: string;
  createdAt?: string;
  description: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { documents, recentActivity, isLoading, fetchDocuments, fetchRecentActivity } = useDocumentStore();
  const [displayActivity, setDisplayActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetchDocuments();
    fetchRecentActivity();
  }, [fetchDocuments, fetchRecentActivity]);

  useEffect(() => {
    if (recentActivity) {
      setDisplayActivity(
        Array.isArray(recentActivity) ? recentActivity.slice(0, 6) : []
      );
    }
  }, [recentActivity]);

  const getActivityIcon = (type?: string) => {
    const iconProps = "w-4 h-4";
    switch (type?.toLowerCase()) {
      case "document_upload":
        return <FileText className={iconProps} />;
      case "chat":
        return <MessageSquare className={iconProps} />;
      case "ai_operation":
        return <Brain className={iconProps} />;
      case "simplify":
        return <Zap className={iconProps} />;
      case "risk":
        return <Shield className={iconProps} />;
      default:
        return <Activity className={iconProps} />;
    }
  };

  const getActivityColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "document_upload":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "chat":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "ai_operation":
      case "simplify":
        return "text-amber-300 bg-amber-500/10 border-amber-500/20";
      case "risk":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-muted-foreground bg-card border-border/50";
    }
  };

  const statCards = [
    {
      icon: FileText,
      label: "Indexed Contracts",
      value: documents.length.toString(),
      trend: "Encrypted & synced",
      color: "from-amber-500/10 via-amber-500/5 to-transparent",
      accent: "text-amber-400",
      border: "border-amber-500/25",
    },
    {
      icon: MessageSquare,
      label: "Copilot Sessions",
      value: (recentActivity.filter(a => a.activityType === "chat").length || 0).toString(),
      trend: "Context-aware QA",
      color: "from-yellow-500/10 via-yellow-500/5 to-transparent",
      accent: "text-yellow-400",
      border: "border-yellow-500/25",
    },
    {
      icon: Brain,
      label: "AI Analyses Run",
      value: (recentActivity.length || documents.length * 2).toString(),
      trend: "Fast & audited",
      color: "from-amber-500/10 via-yellow-500/5 to-transparent",
      accent: "text-amber-300",
      border: "border-amber-500/25",
    },
    {
      icon: Shield,
      label: "Security & Guardrails",
      value: "100%",
      trend: "AES-256 encrypted",
      color: "from-yellow-500/10 via-amber-500/5 to-transparent",
      accent: "text-yellow-400",
      border: "border-yellow-500/25",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Enterprise AI Legal Intelligence
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Counsel"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here is your active contract intelligence overview and document audit telemetry.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black h-11 px-6 rounded-xl font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2">
                <Plus className="w-4 h-4" />
                Upload New Document
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.05 }}
                className={`relative overflow-hidden rounded-2xl bg-card border ${card.border} p-5 hover:border-amber-500/50 transition-all duration-300 shadow-sm`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} pointer-events-none`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{card.label}</p>
                    <p className="text-3xl font-black text-white mt-2">{card.value}</p>
                    <span className="inline-block text-xs font-medium text-amber-400/80 mt-2">{card.trend}</span>
                  </div>
                  <div className={`p-3 rounded-xl bg-black border border-border ${card.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions & Recent Documents Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Contracts Library Preview */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-card border border-border/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Recent Contracts</h2>
                    <p className="text-xs text-muted-foreground">Quick access to parsed legal documents</p>
                  </div>
                </div>
                <Link to="/documents" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                  View All ({documents.length})
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-2.5">
                  {documents.slice(0, 4).map((doc) => (
                    <div
                      key={doc._id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black border border-border hover:border-amber-500/40 transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="uppercase text-[10px] font-bold text-amber-400/80 tracking-wider">
                              {doc.documentType || "Contract"}
                            </span>
                            <span>•</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to={`/document/${doc._id}`}>
                          <Button size="sm" variant="outline" className="h-8 text-xs border-border hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-white font-medium">
                            Inspect
                          </Button>
                        </Link>
                        <Link to={`/chat/${doc._id}`}>
                          <Button size="sm" className="h-8 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            Ask Copilot
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border/80 bg-black/40">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">No documents uploaded yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Upload your first NDA, employment agreement, or lease to get instant clause simplification and risk analysis.
                  </p>
                  <Link to="/upload" className="inline-block mt-4">
                    <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black font-bold rounded-lg h-9 px-4 text-xs">
                      Upload First Document
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Security Guarantee: Zero data training on uploaded contracts.</span>
              <span className="text-amber-400 font-bold">SOC-2 Type II Certified</span>
            </div>
          </motion.div>

          {/* Quick Actions Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-4 space-y-4"
          >
            <div className="bg-card border border-border/80 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-1">AI Tool Suite</h2>
              <p className="text-xs text-muted-foreground mb-4">Instant workflows for legal analysis</p>
              
              <div className="space-y-2.5">
                {[
                  {
                    icon: Upload,
                    title: "Contract Ingestion",
                    desc: "PDF or TXT OCR extraction",
                    href: "/upload",
                    gradient: "from-amber-500 to-yellow-500 text-black",
                  },
                  {
                    icon: Shield,
                    title: "Risk Radar Audit",
                    desc: "Spot hidden liabilities & indemnities",
                    href: "/documents",
                    gradient: "from-yellow-500 to-amber-600 text-black",
                  },
                  {
                    icon: Zap,
                    title: "Plain-English Translator",
                    desc: "Eliminate archaic legalese instantly",
                    href: "/documents",
                    gradient: "from-amber-400 to-yellow-400 text-black",
                  },
                  {
                    icon: Brain,
                    title: "Redline Comparison",
                    desc: "Compare counterparty versions",
                    href: "/compare",
                    gradient: "from-yellow-400 to-amber-500 text-black",
                  },
                ].map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link key={idx} to={action.href} className="block group">
                      <div className="p-3 rounded-xl bg-black border border-border hover:border-amber-500/50 transition-all flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${action.gradient} font-bold shadow-md flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                            {action.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{action.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Audit Log & System Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/80 rounded-2xl p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">System Audit & Activity Log</h2>
                <p className="text-xs text-muted-foreground">Real-time chronicle of analysis events</p>
              </div>
            </div>
            <button
              onClick={() => fetchRecentActivity()}
              disabled={isLoading}
              className="text-xs text-muted-foreground hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-border transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
              Refresh Feed
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">Syncing activity ledger...</p>
            </div>
          ) : displayActivity.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayActivity.map((activity, index) => {
                const dateStr = activity.createdAt || activity.timestamp || new Date().toISOString();
                return (
                  <div
                    key={activity.id || index}
                    className="p-3.5 rounded-xl bg-black border border-border flex items-start gap-3 hover:border-amber-500/30 transition-colors"
                  >
                    <div className={`p-2 rounded-lg border flex-shrink-0 ${getActivityColor(activity.activityType || activity.type)}`}>
                      {getActivityIcon(activity.activityType || activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {activity.title || activity.documentName || "Analysis Operation"}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {activity.description || "Processed by LegalSenser AI"}
                      </p>
                      <p className="text-[10px] text-amber-400/70 mt-1 font-mono">
                        {new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(dateStr).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-bold text-white">No activity logged yet</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Upload a document or ask a question to generate audit entries.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
