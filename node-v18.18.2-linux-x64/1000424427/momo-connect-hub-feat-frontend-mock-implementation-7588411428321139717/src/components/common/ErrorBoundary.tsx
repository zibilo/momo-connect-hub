import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Alert variant="destructive" className="max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                    An unexpected error occurred. Please try refreshing the page.
                    <Button onClick={() => window.location.reload()} className="mt-4 w-full">
                        Refresh Page
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
