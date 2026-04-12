import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  MessageSquare,
  Activity,
  Clock,
  TrendingUp,
  Plus,
  Loader,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ActivityItem {
  id: string;
  type: string;
  documentName: string;
  timestamp: string;
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
        Array.isArray(recentActivity) ? recentActivity.slice(0, 5) : []
      );
    }
  }, [recentActivity]);

  const getActivityIcon = (type: string) => {
    const iconProps = "w-4 h-4";
    switch (type?.toLowerCase()) {
      case "document_upload":
        return <FileText className={iconProps} />;
      case "chat":
        return <MessageSquare className={iconProps} />;
      case "ai_operation":
        return <Brain className={iconProps} />;
      default:
        return <Activity className={iconProps} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "document_upload":
        return "text-blue-400";
      case "chat":
        return "text-purple-400";
      case "ai_operation":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  const statCards = [
    {
      icon: FileText,
      label: "Documents",
      value: documents.length.toString(),
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400",
    },
    {
      icon: MessageSquare,
      label: "AI Chats",
      value: recentActivity.filter(a => a.activityType === "chat").length.toString(),
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
    },
    {
      icon: Brain,
      label: "AI Operations",
      value: recentActivity.filter(a => a.activityType === "ai_operation").length.toString(),
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400",
    },
    {
      icon: TrendingUp,
      label: "Recent Activity",
      value: displayActivity.length.toString(),
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen md:ml-64 relative z-0">
      <div className="p-6 md:p-8 max-w-7xl mx-auto relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                Welcome, {user?.name?.split(" ")[0] || "Legal Professional"}
              </h1>
              <p className="text-slate-400 text-lg">
                Your AI-powered legal document insights for today
              </p>
            </div>
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-8 rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 gap-2">
                <Plus className="w-5 h-5" />
                New Analysis
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`group bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-all relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">{card.label}</p>
                    <p className="text-4xl font-black text-white">{card.value}</p>
                  </div>
                  <div className={`p-3 bg-slate-800 rounded-xl ${card.iconColor} group-hover:bg-white/10 transition-colors`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-6"
          >
            <h2 className="text-xl font-bold text-white px-2">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Upload, label: "Upload Document", href: "/upload", color: "from-blue-600 to-blue-700" },
                { icon: Zap, label: "Simplify Jargon", href: "/documents", color: "from-purple-600 to-purple-700", shadow: "shadow-purple-500/20" },
                { icon: Shield, label: "Analyze Risks", href: "/documents", color: "from-orange-600 to-orange-700", shadow: "shadow-orange-500/20" },
                { icon: Brain, label: "Document Compare", href: "/compare", color: "from-indigo-600 to-indigo-700", shadow: "shadow-indigo-500/20" },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.href}>
                    <motion.button
                      whileHover={{ x: 8 }}
                      className={`w-full bg-slate-900/50 border border-white/5 text-white rounded-xl p-4 font-bold flex items-center gap-4 hover:border-white/20 transition-all text-left glass-morphism`}
                    >
                      <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {action.label}
                    </motion.button>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-slate-900/50 border border-white/5 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              </div>
              <motion.button
                whileHover={{ rotate: 180 }}
                onClick={() => fetchRecentActivity()}
                disabled={isLoading}
                className="text-slate-500 hover:text-white disabled:opacity-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-medium">Updating feed...</p>
              </div>
            ) : displayActivity.length > 0 ? (
              <div className="space-y-4">
                {displayActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group"
                  >
                    <div className={`p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors ${getActivityColor(activity.activityType)}`}>
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{activity.title}</p>
                      <p className="text-slate-400 text-sm truncate">{activity.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-slate-500 text-xs font-medium">
                        {new Date(activity.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-slate-600 text-[10px] uppercase font-bold tracking-tighter">
                        {new Date(activity.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                   <Activity className="w-10 h-10 text-slate-700" />
                </div>
                <p className="text-slate-400 text-lg font-medium">No activity to show</p>
                <p className="text-slate-500 text-sm mt-2">Upload a document to see AI insights in action.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const getActivityIcon = (type: string) => {
  const iconProps = "w-5 h-5";
  switch (type?.toLowerCase()) {
    case "document_upload":
      return <FileText className={iconProps} />;
    case "chat":
      return <MessageSquare className={iconProps} />;
    case "ai_operation":
      return <Brain className={iconProps} />;
    default:
      return <Activity className={iconProps} />;
  }
};

const getActivityColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "document_upload":
      return "text-blue-400";
    case "chat":
      return "text-purple-400";
    case "ai_operation":
      return "text-green-400";
    default:
      return "text-slate-400";
  }
};

import { Shield, Zap } from "lucide-react";
