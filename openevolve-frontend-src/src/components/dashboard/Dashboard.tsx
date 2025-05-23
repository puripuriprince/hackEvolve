import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { PlusCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ExperimentGrid } from '../experiment/ExperimentGrid';
import { SystemMetrics } from './SystemMetrics';
import { WeeklyPerformance } from './WeeklyPerformance';
import { ExperimentFilters } from '../experiment/ExperimentFilters';

export const Dashboard: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62
  });
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    language: 'all',
    model: 'all',
    sortBy: 'newest'
  });

  // Simulate real-time system metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: Math.min(95, Math.max(5, systemMetrics.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(95, Math.max(5, systemMetrics.memory + (Math.random() * 8 - 4)))
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [systemMetrics]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: {
    search: string;
    status: string;
    language: string;
    model: string;
    sortBy: string;
  }) => {
    setFilters(newFilters);
    // If status filter changes, update the active tab
    if (newFilters.status !== filters.status && newFilters.status !== 'all') {
      setActiveTab(newFilters.status);
    }
  }, [filters]);

  // Handle tab changes
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    // Update status filter when tab changes
    setFilters(prev => ({
      ...prev,
      status: value === 'all' ? 'all' : value
    }));
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OpenEvolve Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your evolution experiments
          </p>
        </div>
        <Button className="flex items-center gap-2 sm:self-start">
          <PlusCircle className="h-4 w-4" />
          New Experiment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              +2 since last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              +4 since last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8h</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="mr-1 h-4 w-4 text-green-500" />
              -12min from average
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-amber-500" />
              of monthly quota
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyPerformance height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemMetrics cpu={systemMetrics.cpu} memory={systemMetrics.memory} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Experiments</h2>
        <ExperimentFilters onFilterChange={handleFilterChange} />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Experiments</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <ExperimentGrid />
        </TabsContent>
        <TabsContent value="running" className="mt-6">
          <ExperimentGrid status="running" />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <ExperimentGrid status="completed" />
        </TabsContent>
        <TabsContent value="failed" className="mt-6">
          <ExperimentGrid status="failed" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
