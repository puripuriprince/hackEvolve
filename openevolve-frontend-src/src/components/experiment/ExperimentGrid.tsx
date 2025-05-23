import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Play, Pause, BarChart2, ArrowRight, Clock, Code } from "lucide-react";
import { Progress } from "../ui/progress";

interface ExperimentGridProps {
  status?: 'running' | 'completed' | 'failed';
}

// Mock data for experiments
const mockExperiments = [
  {
    id: 1,
    name: "Sorting Algorithm Optimization",
    description: "Evolving a more efficient sorting algorithm for large datasets",
    status: "running",
    bestScore: 0.87,
    iterations: 42,
    totalIterations: 100,
    duration: "1h 23m",
    lastUpdated: "2 minutes ago",
    language: "JavaScript",
    model: "GPT-4o"
  },
  {
    id: 2,
    name: "Neural Network Pruning",
    description: "Evolving a technique to reduce model size while maintaining accuracy",
    status: "running",
    bestScore: 0.92,
    iterations: 78,
    totalIterations: 100,
    duration: "3h 12m",
    lastUpdated: "5 minutes ago",
    language: "Python",
    model: "Claude 3 Opus"
  },
  {
    id: 3,
    name: "Database Query Optimization",
    description: "Evolving more efficient SQL queries for complex joins",
    status: "completed",
    bestScore: 0.95,
    iterations: 120,
    totalIterations: 120,
    duration: "4h 45m",
    lastUpdated: "Yesterday",
    language: "SQL",
    model: "GPT-4o"
  },
  {
    id: 4,
    name: "Image Processing Pipeline",
    description: "Evolving an optimized pipeline for real-time image processing",
    status: "completed",
    bestScore: 0.89,
    iterations: 67,
    totalIterations: 67,
    duration: "2h 30m",
    lastUpdated: "2 days ago",
    language: "Python",
    model: "Claude 3 Opus"
  },
  {
    id: 5,
    name: "Memory Allocation Strategy",
    description: "Evolving a custom memory allocator for embedded systems",
    status: "failed",
    bestScore: 0.45,
    iterations: 23,
    totalIterations: 100,
    duration: "0h 58m",
    lastUpdated: "3 days ago",
    language: "C",
    model: "CodeLlama 70B"
  },
  {
    id: 6,
    name: "Path Finding Algorithm",
    description: "Evolving a specialized path finding algorithm for 3D environments",
    status: "running",
    bestScore: 0.78,
    iterations: 31,
    totalIterations: 100,
    duration: "0h 47m",
    lastUpdated: "Just now",
    language: "C++",
    model: "GPT-4o"
  }
];

export const ExperimentGrid: React.FC<ExperimentGridProps> = ({ status }) => {
  // Filter experiments based on status prop if provided
  const filteredExperiments = status 
    ? mockExperiments.filter(exp => exp.status === status)
    : mockExperiments;

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'running': return <Play className="h-3 w-3" />;
      case 'completed': return <BarChart2 className="h-3 w-3" />;
      case 'failed': return <Code className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredExperiments.map((experiment) => (
        <Card 
          key={experiment.id} 
          className="flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{experiment.name}</h3>
              <Badge 
                variant={
                  experiment.status === "running" ? "default" : 
                  experiment.status === "completed" ? "secondary" : "destructive"
                }
                className="flex items-center gap-1"
              >
                {getStatusIcon(experiment.status)}
                {experiment.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{experiment.description}</p>
          </CardHeader>
          <CardContent className="pb-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{experiment.iterations}/{experiment.totalIterations}</span>
              </div>
              <Progress 
                value={(experiment.iterations / experiment.totalIterations) * 100} 
                className={`h-2 ${getStatusColor(experiment.status)}`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Best Score</span>
                <span className="font-medium">{experiment.bestScore.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">{experiment.duration}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Language</span>
                <span className="font-medium">{experiment.language}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Model</span>
                <span className="font-medium">{experiment.model}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 mt-auto">
            <div className="flex w-full justify-between">
              {experiment.status === "running" ? (
                <Button variant="outline" size="sm" className="gap-1">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              ) : experiment.status === "completed" ? (
                <Button variant="outline" size="sm" className="gap-1">
                  <BarChart2 className="h-4 w-4" />
                  Results
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="gap-1">
                  <Play className="h-4 w-4" />
                  Retry
                </Button>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{experiment.lastUpdated}</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ExperimentGrid;
