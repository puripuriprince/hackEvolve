import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Save, Play, Download } from "lucide-react";
import Editor from "@monaco-editor/react";

export const ExperimentCreation: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [code, setCode] = useState<string>(`// Your initial program
function bubbleSort(arr) {
  // EVOLVE-BLOCK-START
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
  // EVOLVE-BLOCK-END
  return arr;
}`);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Experiment</h1>
      </div>

      <div className="flex items-center">
        <nav className="flex" aria-label="Progress">
          <ol role="list" className="space-y-6 md:flex md:space-x-8 md:space-y-0">
            {[
              { id: 1, name: 'Initial Program' },
              { id: 2, name: 'Evaluator Function' },
              { id: 3, name: 'Model Selection' },
              { id: 4, name: 'Parameters' },
            ].map((stepItem) => (
              <li key={stepItem.name} className="md:flex-1">
                <div 
                  className={`flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                    step >= stepItem.id ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <span className={`text-sm font-medium ${step >= stepItem.id ? 'text-primary' : 'text-muted-foreground'}`}>
                    Step {stepItem.id}
                  </span>
                  <span className="text-sm">{stepItem.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Initial Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Tabs defaultValue="editor">
                <TabsList>
                  <TabsTrigger value="editor">Code Editor</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="mt-4">
                  <div className="border rounded-md h-[500px]">
                    <Editor
                      height="500px"
                      defaultLanguage="javascript"
                      value={code}
                      onChange={handleEditorChange}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <div className="flex items-center justify-center border rounded-md h-[500px]">
                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                          <Download className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-semibold">Upload your code file</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Drag and drop your file here or click to browse
                        </p>
                        <Button>Select File</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="templates" className="mt-4">
                  <div className="grid grid-cols-2 gap-4 h-[500px] overflow-y-auto">
                    {[
                      { name: "Sorting Algorithm", language: "JavaScript" },
                      { name: "Neural Network", language: "Python" },
                      { name: "Database Query", language: "SQL" },
                      { name: "Image Processing", language: "Python" },
                      { name: "Path Finding", language: "C++" },
                      { name: "Memory Allocator", language: "C" },
                    ].map((template, i) => (
                      <Card key={i} className="cursor-pointer hover:bg-muted/50">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground">Language: {template.language}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={() => setStep(2)}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluator Function</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="border rounded-md h-[500px]">
                <Editor
                  height="500px"
                  defaultLanguage="javascript"
                  value={`// Define your evaluator function
function evaluate(program) {
  // Create test cases
  const testCases = [
    { input: [5, 3, 8, 4, 2], expected: [2, 3, 4, 5, 8] },
    { input: [1, 1, 1, 1], expected: [1, 1, 1, 1] },
    { input: [9, 8, 7, 6, 5, 4], expected: [4, 5, 6, 7, 8, 9] },
    { input: [], expected: [] },
    { input: [10000, 10, 1, 100, 1000], expected: [1, 10, 100, 1000, 10000] }
  ];
  
  // Run tests and calculate score
  let correctTests = 0;
  let totalTime = 0;
  
  for (const test of testCases) {
    const startTime = performance.now();
    const result = program(test.input.slice());
    const endTime = performance.now();
    
    totalTime += (endTime - startTime);
    
    // Check correctness
    const isCorrect = JSON.stringify(result) === JSON.stringify(test.expected);
    if (isCorrect) correctTests++;
  }
  
  // Calculate score (75% correctness, 25% speed)
  const correctnessScore = correctTests / testCases.length;
  const timeScore = Math.min(1, 10 / totalTime); // Normalize time score
  
  return (correctnessScore * 0.75) + (timeScore * 0.25);
}`}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                  }}
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Model Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    name: "GPT-4o", 
                    description: "Powerful general-purpose model with strong coding abilities",
                    cost: "$0.01 / 1K tokens",
                    recommended: true
                  },
                  { 
                    name: "Claude 3 Opus", 
                    description: "Excellent for complex reasoning and code generation",
                    cost: "$0.015 / 1K tokens",
                    recommended: false
                  },
                  { 
                    name: "CodeLlama 70B", 
                    description: "Specialized for code generation and understanding",
                    cost: "$0.005 / 1K tokens",
                    recommended: false
                  },
                  { 
                    name: "GPT-3.5 Turbo", 
                    description: "Fast and cost-effective for simpler tasks",
                    cost: "$0.002 / 1K tokens",
                    recommended: false
                  },
                ].map((model, i) => (
                  <Card key={i} className={`cursor-pointer hover:bg-muted/50 ${model.recommended ? 'border-primary' : ''}`}>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{model.name}</CardTitle>
                        {model.recommended && (
                          <Badge>Recommended</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm mb-2">{model.description}</p>
                      <p className="text-sm text-muted-foreground">Cost: {model.cost}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-2">Estimated Cost</h3>
                <div className="flex justify-between">
                  <span>Based on your code size and parameters:</span>
                  <span className="font-medium">$0.25 - $0.40</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={() => setStep(4)}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolution Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Population Size</label>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    defaultValue="20"
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5</span>
                    <span>20</span>
                    <span>50</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Generations</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    defaultValue="30"
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10</span>
                    <span>30</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Mutation Rate</label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="0.9" 
                    step="0.1"
                    defaultValue="0.3"
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.1</span>
                    <span>0.3</span>
                    <span>0.9</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Crossover Rate</label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="0.9" 
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.1</span>
                    <span>0.7</span>
                    <span>0.9</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-2">Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="elitism" defaultChecked />
                    <label htmlFor="elitism" className="text-sm">Enable Elitism</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="parallel" defaultChecked />
                    <label htmlFor="parallel" className="text-sm">Parallel Evaluation</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="early" />
                    <label htmlFor="early" className="text-sm">Early Stopping</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="checkpoint" defaultChecked />
                    <label htmlFor="checkpoint" className="text-sm">Auto Checkpoints</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Start Evolution
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExperimentCreation;
