import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Meals from "@/pages/Meals";
import Tracker from "@/pages/Tracker";
import Profile from "@/pages/Profile";
import Challenges from "@/pages/Challenges";
import Community from "@/pages/Community";

import Contact from "@/pages/Contact";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/workouts" component={Workouts} />
        <Route path="/meals" component={Meals} />
        <Route path="/tracker" component={Tracker} />
        <Route path="/challenges" component={Challenges} />
        <Route path="/community" component={Community} />
        <Route path="/profile" component={Profile} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
