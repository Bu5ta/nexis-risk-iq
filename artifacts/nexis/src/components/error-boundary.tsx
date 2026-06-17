import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { children: React.ReactNode }
interface State { hasError: boolean; error: string }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              This page encountered an unexpected error. Your data is safe — try refreshing.
            </p>
            {this.state.error && (
              <p className="text-xs text-muted-foreground font-mono bg-muted rounded px-3 py-1.5 mt-2 max-w-md truncate">
                {this.state.error}
              </p>
            )}
          </div>
          <Button onClick={() => { this.setState({ hasError: false, error: "" }); window.location.reload(); }} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reload page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
