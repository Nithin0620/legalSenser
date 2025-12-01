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
  const { recentActivity, isLoading, error, fetchRecentActivity } = useDocumentStore();
  const [displayActivity, setDisplayActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

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
      case "upload":
        return <FileText className={iconProps} />;
      case "chat":
        return <MessageSquare className={iconProps} />;
      case "simplify":
      case "summarize":
      case "analyze-risk":
      case "compare":
        return <BarChart3 className={iconProps} />;
      default:
        return <Activity className={iconProps} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "upload":
        return "text-blue-400";
      case "chat":
        return "text-purple-400";
      case "simplify":
      case "summarize":
        return "text-green-400";
      case "analyze-risk":
        return "text-orange-400";
      case "compare":
        return "text-pink-400";
      default:
        return "text-slate-400";
    }
  };

  const statCards = [
    {
      icon: FileText,
      label: "Documents",
      value: "0",
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400",
    },
    {
      icon: MessageSquare,
      label: "AI Chats",
      value: "0",
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
    },
    {
      icon: BarChart3,
      label: "AI Operations",
      value: "0",
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400",
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: displayActivity.length.toString(),
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 md:ml-64 md:pt-0 pt-20">
      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-slate-400 text-lg">
                Here's what's happening with your legal documents today
              </p>
            </div>
            <Link to="/upload">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Upload Document
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`bg-gradient-to-br ${card.color} border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/80 transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">{card.label}</p>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                  </div>
                  <div className={`p-3 bg-slate-800/50 rounded-lg ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: FileText, label: "Upload", href: "/upload", color: "from-blue-500 to-blue-600" },
              { icon: MessageSquare, label: "Chat", href: "/chat", color: "from-purple-500 to-purple-600" },
              { icon: FileText, label: "Documents", href: "/documents", color: "from-green-500 to-green-600" },
              { icon: BarChart3, label: "Analytics", href: "/dashboard", color: "from-orange-500 to-orange-600" },
              { icon: Activity, label: "History", href: "/history", color: "from-pink-500 to-pink-600" },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${action.color} text-white rounded-lg p-4 font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-${action.color.split(" ")[1]}/20 transition-all`}
                  >
                    <Icon className="w-5 h-5" />
                    {action.label}
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <motion.button
              whileHover={{ rotate: 180 }}
              onClick={() => fetchRecentActivity()}
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-300 disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3 mb-4"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : displayActivity.length > 0 ? (
            <div className="space-y-4">
              {displayActivity.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-slate-700/20 border border-slate-600/30 rounded-lg hover:bg-slate-700/40 transition-colors"
                >
                  <div className={`p-2 bg-slate-700/50 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-100 font-medium">{activity.description}</p>
                    <p className="text-slate-400 text-sm">{activity.documentName}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(activity.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className={`px-3 py-1 bg-slate-700/50 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No activity yet</p>
              <p className="text-slate-500 text-sm mt-2">Start by uploading your first document</p>
              <Link to="/upload" className="mt-4 inline-block">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  Upload Document
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
