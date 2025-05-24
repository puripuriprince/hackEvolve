import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { JailbreakChatbox } from './JailbreakChatbox';
import { AlertTriangle } from 'lucide-react';

interface JailbreakPoint {
  generation: number;
  pointIndex: number;
  unsafePercentage: number;
  jailbreakPrompt: string;
  modelResponse: string;
  timestamp: number;
  id: string;
}

// Custom dot component for scatter plot
const CustomDot = ({ 
  cx, 
  cy, 
  payload, 
  hoveredPoint, 
  setHoveredPoint, 
  setSelectedPoint,
  topPerformers
}: any) => {
  const isHovered = hoveredPoint?.id === payload.id;
  const isTopPerformer = topPerformers.has(payload.id);
  const isCurrent = payload.generation === Math.max(...topPerformers.values());
  
  // Determine color and size based on state
  let fill = '#92400e'; // Default brown
  let size = 4; // Default size
  
  if (isTopPerformer || isCurrent) {
    fill = '#f97316'; // Orange for top performers or current
    size = isCurrent ? 6 : 4; // Larger for current
  }
  
  if (isHovered) {
    size = 8; // Larger when hovered
  }
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={size}
      fill={fill}
      stroke={isHovered ? 'white' : 'none'}
      strokeWidth={isHovered ? 2 : 0}
      filter={isHovered ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))' : 'none'}
      style={{ 
        transition: 'all 200ms ease-in-out',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setHoveredPoint(payload)}
      onMouseLeave={() => setHoveredPoint(null)}
      onClick={() => {
        if (isHovered) {
          setSelectedPoint(payload);
        }
      }}
    />
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="font-bold text-sm mb-1">
          Generation {data.generation}, Point {data.pointIndex}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Unsafe %: {data.unsafePercentage.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

export const JailbreakEvolution: React.FC = () => {
  const [data, setData] = useState<JailbreakPoint[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<JailbreakPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<JailbreakPoint | null>(null);
  const [topPerformers, setTopPerformers] = useState<Set<string>>(new Set());
  
  // Function to find top performer only at generation intervals of 10 (10, 20, 30, etc.)
  const updateTopPerformers = useCallback((points: JailbreakPoint[]) => {
    const newTopPerformers = new Set<string>();
    
    // Only consider generations that are multiples of 10
    const intervalGenerations = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    intervalGenerations.forEach(generation => {
      const generationPoints = points.filter(point => point.generation === generation);
      if (generationPoints.length > 0) {
        const topPoint = generationPoints.reduce((max, point) => 
          point.unsafePercentage > max.unsafePercentage ? point : max, 
          generationPoints[0]
        );
        newTopPerformers.add(topPoint.id);
      }
    });
    
    setTopPerformers(newTopPerformers);
  }, []);
  
  // Simulate real-time data generation
  useEffect(() => {
    if (currentGeneration >= 100) return;
    
    const interval = setInterval(() => {
      // Generate 10 new points for the next generation
      const newGeneration = currentGeneration + 1;
      const newPoints: JailbreakPoint[] = [];
      
      for (let i = 0; i < 10; i++) {
        const unsafePercentage = Math.random() * 100;
        newPoints.push({
          generation: newGeneration,
          pointIndex: i,
          unsafePercentage,
          jailbreakPrompt: `Example jailbreak prompt for generation ${newGeneration}, point ${i}`,
          modelResponse: `Example model response for generation ${newGeneration}, point ${i}`,
          timestamp: Date.now(),
          id: `gen-${newGeneration}-point-${i}`
        });
      }
      
      const updatedData = [...data, ...newPoints];
      setData(updatedData);
      setCurrentGeneration(newGeneration);
      updateTopPerformers(updatedData);
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [currentGeneration, data, updateTopPerformers]);
  
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Jailbreak Evolution Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tracking unsafe responses across generations
            </p>
          </div>
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Safety Testing</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="generation" 
                  name="Generation" 
                  domain={[0, 100]}
                  tickCount={11}
                  label={{ value: 'Generation', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="unsafePercentage" 
                  name="Unsafe %" 
                  domain={[0, 100]}
                  label={{ value: 'Unsafe Percentage', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Reference lines every 10 generations */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <ReferenceLine 
                    key={`ref-${i}`} 
                    x={(i + 1) * 10} 
                    stroke="#374151" 
                    strokeDasharray="3 3" 
                  />
                ))}
                
                <Scatter 
                  name="Jailbreak Attempts" 
                  data={data} 
                  fill="#92400e"
                  shape={(props: any) => (
                    <CustomDot 
                      {...props} 
                      hoveredPoint={hoveredPoint}
                      setHoveredPoint={setHoveredPoint}
                      selectedPoint={selectedPoint}
                      setSelectedPoint={setSelectedPoint}
                      topPerformers={topPerformers}
                    />
                  )}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
              <span>Top performers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-800"></span>
              <span>Other attempts</span>
            </div>
            <div>
              <span className="font-medium">Current Generation: {currentGeneration}/100</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Jailbreak Chatbox Modal */}
      {selectedPoint && (
        <JailbreakChatbox 
          point={selectedPoint} 
          onClose={() => setSelectedPoint(null)} 
        />
      )}
    </div>
  );
};

export default JailbreakEvolution;
