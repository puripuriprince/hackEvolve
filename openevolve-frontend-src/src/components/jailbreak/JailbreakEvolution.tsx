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

export const JailbreakEvolution: React.FC = () => {
  const [data, setData] = useState<JailbreakPoint[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<JailbreakPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<JailbreakPoint | null>(null);
  const [topPerformers, setTopPerformers] = useState<Set<string>>(new Set());
  
  // Function to find top performer in each 10-generation interval
  const updateTopPerformers = useCallback((points: JailbreakPoint[]) => {
    const newTopPerformers = new Set<string>();
    
    // Group points by 10-generation intervals
    const intervals: { [key: number]: JailbreakPoint[] } = {};
    
    points.forEach(point => {
      const interval = Math.floor(point.generation / 10) * 10;
      if (!intervals[interval]) {
        intervals[interval] = [];
      }
      intervals[interval].push(point);
    });
    
    // Find top performer in each interval
    Object.values(intervals).forEach(intervalPoints => {
      if (intervalPoints.length > 0) {
        const topPoint = intervalPoints.reduce((max, point) => 
          point.unsafePercentage > max.unsafePercentage ? point : max, 
          intervalPoints[0]
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
                  label={{ value: 'Unsafe Percentage', angle: -90, position: 'insideLeft' }}
                  unit="%"
                />
                <Tooltip 
                  formatter={(value: any) => [`${value.toFixed(2)}%`, 'Unsafe']}
                  labelFormatter={(label: any) => `Generation ${label}`}
                />
                
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
