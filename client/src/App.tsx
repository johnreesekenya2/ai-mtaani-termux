import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import WelcomePage from "@/pages/welcome-page";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import VerifyEmailPage from "@/pages/verify-email-page";
import WorkspacePage from "@/pages/workspace-page";
import FilesPage from "@/pages/files-page";
import GitHubPage from "@/pages/github-page";
import CreditsPage from "@/pages/credits-page";
import AboutPage from "@/pages/about-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/workspace/:projectId" component={WorkspacePage} />
      <ProtectedRoute path="/files/:projectId" component={FilesPage} />
      <ProtectedRoute path="/github" component={GitHubPage} />
      <ProtectedRoute path="/credits" component={CreditsPage} />
      <ProtectedRoute path="/about" component={AboutPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/verify-email" component={VerifyEmailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;