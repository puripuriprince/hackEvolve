import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "../ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";

// Mock data for evolution metrics
const mockEvolutionData = [
  { generation: 1, bestScore: 0.42, avgScore: 0.28, diversity: 0.85 },
  { generation: 2, bestScore: 0.48, avgScore: 0.32, diversity: 0.82 },
  { generation: 3, bestScore: 0.53, avgScore: 0.38, diversity: 0.79 },
  { generation: 4, bestScore: 0.59, avgScore: 0.42, diversity: 0.76 },
  { generation: 5, bestScore: 0.64, avgScore: 0.45, diversity: 0.74 },
  { generation: 6, bestScore: 0.68, avgScore: 0.49, diversity: 0.71 },
  { generation: 7, bestScore: 0.72, avgScore: 0.52, diversity: 0.69 },
  { generation: 8, bestScore: 0.75, avgScore: 0.55, diversity: 0.67 },
  { generation: 9, bestScore: 0.79, avgScore: 0.58, diversity: 0.65 },
  { generation: 10, bestScore: 0.82, avgScore: 0.61, diversity: 0.63 },
  { generation: 11, bestScore: 0.84, avgScore: 0.63, diversity: 0.61 },
  { generation: 12, bestScore: 0.87, avgScore: 0.65, diversity: 0.59 },
];

export const EvolutionMonitoring: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sorting Algorithm Optimization</h1>
            <p className="text-muted-foreground">
              Evolution in progress - Generation 12 of 30
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="default">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.87</div>
            <p className="text-xs text-muted-foreground">
              +0.03 from last generation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.65</div>
            <p className="text-xs text-muted-foreground">
              +0.02 from last generation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Population Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">59%</div>
            <p className="text-xs text-muted-foreground">
              -2% from last generation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              $2.48 cost so far
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolution Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockEvolutionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="generation" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bestScore" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="avgScore" stroke="#82ca9d" />
                <Line type="monotone" dataKey="diversity" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="logs">Live Logs</TabsTrigger>
          <TabsTrigger value="lineage">Lineage Tree</TabsTrigger>
        </TabsList>
        <TabsContent value="programs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Generation {14 - i} - Program #{i}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Score: {0.87 - (i * 0.02)}</span>
                        <Button variant="outline" size="sm">View Code</Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 ? 
                        "Optimized bubble sort with early termination and reduced swaps" : 
                        i === 2 ? 
                        "Hybrid approach combining bubble sort with insertion sort for small subarrays" :
                        "Modified bubble sort with bidirectional sweeping pattern"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-[400px] overflow-y-auto">
                <div>[22:41:05] Starting evolution run with population size 20</div>
                <div>[22:41:06] Initializing population with random variations</div>
                <div>[22:41:10] Generation 1 complete. Best score: 0.42</div>
                <div>[22:41:15] Generation 2 complete. Best score: 0.48</div>
                <div>[22:41:20] Generation 3 complete. Best score: 0.53</div>
                <div>[22:41:25] Generation 4 complete. Best score: 0.59</div>
                <div>[22:41:30] Generation 5 complete. Best score: 0.64</div>
                <div>[22:41:35] Generation 6 complete. Best score: 0.68</div>
                <div>[22:41:40] Generation 7 complete. Best score: 0.72</div>
                <div>[22:41:45] Generation 8 complete. Best score: 0.75</div>
                <div>[22:41:50] Generation 9 complete. Best score: 0.79</div>
                <div>[22:41:55] Generation 10 complete. Best score: 0.82</div>
                <div>[22:42:00] Generation 11 complete. Best score: 0.84</div>
                <div>[22:42:05] Generation 12 complete. Best score: 0.87</div>
                <div>[22:42:06] Creating checkpoint at generation 12</div>
                <div>[22:42:07] Analyzing population diversity...</div>
                <div>[22:42:08] Diversity at 59%, applying mutation boost</div>
                <div>[22:42:09] Preparing for generation 13...</div>
                <div className="animate-pulse">[22:42:10] _</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lineage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolution Lineage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Lineage tree visualization will appear here</p>
                  <p>Showing ancestry and relationships between evolved programs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvolutionMonitoring;
