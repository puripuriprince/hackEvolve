import React from 'react';
import { ThemeProvider } from './components/ui/theme-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Search, Sun, Moon, PlusCircle, Bell } from "lucide-react";
import { Input } from "./components/ui/input";
import { useTheme } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AccessibilityFeatures } from "./components/ui/accessibility";
import Dashboard from './components/dashboard/Dashboard';
import JailbreakEvolution from './components/jailbreak/JailbreakEvolution';
import ExperimentCreation from './components/experiment/ExperimentCreation';
import EvolutionMonitoring from './components/monitoring/EvolutionMonitoring';
import ResultsAnalysis from './components/analysis/ResultsAnalysis';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";

// Theme toggle component
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

function App() {
  const [notificationCount, setNotificationCount] = React.useState(3);
  
  // Simulate real-time notifications
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to add a notification
      if (Math.random() > 0.8) {
        setNotificationCount(prev => prev + 1);
        
        // Announce to screen readers
        if (typeof window !== 'undefined' && 'announce' in window) {
          (window as any).announce("New notification received");
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="openevolve-theme">
      <AccessibilityFeatures>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
          <Tabs defaultValue="dashboard" className="w-full">
            <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center px-4 md:px-6">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span>OpenEvolve</span>
                </div>
                <TabsList className="ml-6 hidden md:flex">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="jailbreak">Jailbreak Analysis</TabsTrigger>
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="monitor">Monitor</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search experiments..."
                      className="w-64 pl-8"
                      aria-label="Search experiments"
                    />
                  </div>
                  
                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`${notificationCount} notifications`}>
                        <Bell className="h-5 w-5" />
                        {notificationCount > 0 && (
                          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="flex items-center justify-between p-2">
                        <span className="text-sm font-medium">Notifications</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setNotificationCount(0)}
                        >
                          Clear all
                        </Button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notificationCount > 0 ? (
                          Array.from({ length: notificationCount }).map((_, i) => (
                            <DropdownMenuItem key={i} className="flex flex-col items-start p-3">
                              <span className="font-medium">Experiment Update</span>
                              <span className="text-sm text-muted-foreground">
                                {i % 3 === 0 
                                  ? "Sorting Algorithm Optimization completed" 
                                  : i % 3 === 1 
                                  ? "Neural Network Pruning reached 80% score" 
                                  : "New experiment started"}
                              </span>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <ThemeToggle />
                  <Button className="hidden md:flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    New Experiment
                  </Button>
                </div>
              </div>
              <TabsList className="flex md:hidden justify-between px-4 pb-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="jailbreak">Jailbreak</TabsTrigger>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="monitor">Monitor</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="dashboard" className="w-full">
              <Dashboard />
            </TabsContent>
            <TabsContent value="jailbreak" className="w-full">
              <JailbreakEvolution />
            </TabsContent>
            <TabsContent value="create" className="w-full">
              <ExperimentCreation />
            </TabsContent>
            <TabsContent value="monitor" className="w-full">
              <EvolutionMonitoring />
            </TabsContent>
            <TabsContent value="results" className="w-full">
              <ResultsAnalysis />
            </TabsContent>
          </Tabs>
          <Toaster />
        </div>
      </AccessibilityFeatures>
    </ThemeProvider>
  );
}

export default App;
