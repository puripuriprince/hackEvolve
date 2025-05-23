import React from 'react';
import { Progress } from "../ui/progress";

interface SystemMetricsProps {
  cpu: number;
  memory: number;
  storage?: number;
  network?: number;
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ 
  cpu, 
  memory, 
  storage = 42.8, 
  network = 28 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">CPU Usage</div>
          <div className="text-sm text-muted-foreground">{cpu.toFixed(1)}%</div>
        </div>
        <Progress 
          value={cpu} 
          className={`h-2 ${cpu > 80 ? 'bg-red-500' : cpu > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
          aria-label="CPU usage"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Memory Usage</div>
          <div className="text-sm text-muted-foreground">{memory.toFixed(1)}%</div>
        </div>
        <Progress 
          value={memory} 
          className={`h-2 ${memory > 80 ? 'bg-red-500' : memory > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
          aria-label="Memory usage"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Storage</div>
          <div className="text-sm text-muted-foreground">{storage.toFixed(1)}%</div>
        </div>
        <Progress 
          value={storage} 
          className="h-2"
          aria-label="Storage usage"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Network</div>
          <div className="text-sm text-muted-foreground">12.4 MB/s</div>
        </div>
        <Progress 
          value={network} 
          className="h-2"
          aria-label="Network usage"
        />
      </div>
    </div>
  );
};

export default SystemMetrics;
