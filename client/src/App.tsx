import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/Home";
import Following from "@/pages/Following";
import Explore from "@/pages/Explore";
import History from "@/pages/History";
import Bookmarks from "@/pages/Bookmarks";
import Settings from "@/pages/Settings";
import ArticleView from "@/pages/ArticleView";
import NewPost from "@/pages/NewPost";
import TechSources from "@/pages/TechSources";
import SearchResults from "@/pages/SearchResults";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/following" component={Following} />
      <Route path="/explore" component={Explore} />
      <Route path="/history" component={History} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/settings" component={Settings} />
      <Route path="/article/:id" component={ArticleView} />
      <Route path="/new-post" component={NewPost} />
      <Route path="/tech-sources" component={TechSources} />
      <Route path="/search" component={SearchResults} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
