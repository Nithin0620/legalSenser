import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LegalSenser ErrorBoundary caught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-2xl">
            <div className="inline-block relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl blur opacity-60"></div>
              <div className="relative bg-black border border-amber-500/30 rounded-xl p-3">
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Something Went Wrong</h1>
            <p className="text-muted-foreground text-xs mb-6">
              An unexpected issue occurred while rendering this interface.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 bg-black/60 border border-border rounded-xl text-left overflow-auto max-h-32">
                <p className="text-xs font-mono text-destructive">{this.state.error.message}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold h-11 rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Application
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = "/";
                }}
                className="w-full border-border text-white hover:bg-white/5 h-11 rounded-xl text-xs"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
