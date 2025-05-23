import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { ArrowLeft, Download, Code, Share2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Editor from "@monaco-editor/react";

// Mock data for results
const mockPerformanceData = [
  { name: 'Test 1', original: 45, evolved: 12 },
  { name: 'Test 2', original: 32, evolved: 8 },
  { name: 'Test 3', original: 78, evolved: 22 },
  { name: 'Test 4', original: 56, evolved: 15 },
  { name: 'Test 5', original: 92, evolved: 24 },
];

const mockGenerationData = [
  { generation: 1, score: 0.42 },
  { generation: 5, score: 0.64 },
  { generation: 10, score: 0.82 },
  { generation: 15, score: 0.89 },
  { generation: 20, score: 0.93 },
  { generation: 25, score: 0.95 },
  { generation: 30, score: 0.96 },
];

export const ResultsAnalysis: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sorting Algorithm Results</h1>
            <p className="text-muted-foreground">
              Evolution completed - 30 generations
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="default">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Final Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.96</div>
            <p className="text-xs text-muted-foreground">
              +128% improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8x</div>
            <p className="text-xs text-muted-foreground">
              Faster than original
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">
              600 programs evaluated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5.82</div>
            <p className="text-xs text-muted-foreground">
              582 API calls
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Best Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md h-[400px]">
            <Editor
              height="400px"
              defaultLanguage="javascript"
              value={`function bubbleSort(arr) {
  // EVOLVED CODE
  let n = arr.length;
  let swapped;
  
  // Early return for empty or single-element arrays
  if (n <= 1) return arr;
  
  // Optimization: track the last position where a swap occurred
  // Elements after this position are already sorted
  let newn;
  
  do {
    swapped = false;
    newn = 0;
    
    for (let i = 1; i < n; i++) {
      // Compare adjacent elements and swap if needed
      if (arr[i - 1] > arr[i]) {
        // Optimized swap without temporary variable
        arr[i - 1] = arr[i - 1] ^ arr[i];
        arr[i] = arr[i - 1] ^ arr[i];
        arr[i - 1] = arr[i - 1] ^ arr[i];
        
        // Record position of last swap
        newn = i;
        swapped = true;
      }
    }
    
    // Update n to avoid unnecessary comparisons
    n = newn;
    
  } while (swapped);
  
  return arr;
}`}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: true
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockPerformanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="original" fill="#8884d8" name="Original" />
                  <Bar dataKey="evolved" fill="#82ca9d" name="Evolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolution Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockGenerationData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="generation" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList>
          <TabsTrigger value="comparison">Code Comparison</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="history">Evolution History</TabsTrigger>
        </TabsList>
        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Original vs. Evolved Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Original Code</h3>
                  <div className="border rounded-md h-[300px]">
                    <Editor
                      height="300px"
                      defaultLanguage="javascript"
                      value={`function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        readOnly: true
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Evolved Code</h3>
                  <div className="border rounded-md h-[300px]">
                    <Editor
                      height="300px"
                      defaultLanguage="javascript"
                      value={`function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  
  // Early return for empty or single-element arrays
  if (n <= 1) return arr;
  
  // Optimization: track the last position where a swap occurred
  // Elements after this position are already sorted
  let newn;
  
  do {
    swapped = false;
    newn = 0;
    
    for (let i = 1; i < n; i++) {
      // Compare adjacent elements and swap if needed
      if (arr[i - 1] > arr[i]) {
        // Optimized swap without temporary variable
        arr[i - 1] = arr[i - 1] ^ arr[i];
        arr[i] = arr[i - 1] ^ arr[i];
        arr[i - 1] = arr[i - 1] ^ arr[i];
        
        // Record position of last swap
        newn = i;
        swapped = true;
      }
    }
    
    // Update n to avoid unnecessary comparisons
    n = newn;
    
  } while (swapped);
  
  return arr;
}`}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        readOnly: true
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Key Improvements</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Early return for trivial cases (empty or single-element arrays)</li>
                  <li>Tracking last swap position to avoid unnecessary comparisons</li>
                  <li>Using XOR swap for more efficient memory usage</li>
                  <li>Implementing a do-while loop with swapped flag for early termination</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metrics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Time Complexity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Original:</p>
                      <p className="text-sm">O(n²) - worst, average, best cases</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Evolved:</p>
                      <p className="text-sm">O(n²) - worst case</p>
                      <p className="text-sm">O(n) - best case (already sorted)</p>
                      <p className="text-sm">O(n²) - average case, but with fewer comparisons</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Memory Usage</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Original:</p>
                      <p className="text-sm">O(1) - constant extra space</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Evolved:</p>
                      <p className="text-sm">O(1) - constant extra space</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Test Case Performance</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Test Case</th>
                        <th className="text-right pb-2">Original (ms)</th>
                        <th className="text-right pb-2">Evolved (ms)</th>
                        <th className="text-right pb-2">Improvement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Random Array (n=1000)</td>
                        <td className="text-right">45</td>
                        <td className="text-right">12</td>
                        <td className="text-right text-green-500">3.8x</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Nearly Sorted (n=1000)</td>
                        <td className="text-right">32</td>
                        <td className="text-right">8</td>
                        <td className="text-right text-green-500">4.0x</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Reverse Sorted (n=1000)</td>
                        <td className="text-right">78</td>
                        <td className="text-right">22</td>
                        <td className="text-right text-green-500">3.5x</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Few Unique (n=1000)</td>
                        <td className="text-right">56</td>
                        <td className="text-right">15</td>
                        <td className="text-right text-green-500">3.7x</td>
                      </tr>
                      <tr>
                        <td className="py-2">Large Array (n=10000)</td>
                        <td className="text-right">92</td>
                        <td className="text-right">24</td>
                        <td className="text-right text-green-500">3.8x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Generation {i * 10}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Score: {0.42 + (i * 0.18)}</span>
                        <Button variant="outline" size="sm">
                          <Code className="h-4 w-4 mr-2" />
                          View Code
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 ? 
                        "Initial optimization: Added early termination with swapped flag" : 
                        i === 2 ? 
                        "Mid evolution: Implemented tracking of last swap position" :
                        "Final evolution: Added early return for trivial cases and XOR swap"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsAnalysis;
