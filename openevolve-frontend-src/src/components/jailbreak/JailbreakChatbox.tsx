import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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

interface JailbreakChatboxProps {
  point: JailbreakPoint;
  onClose: () => void;
}

export const JailbreakChatbox: React.FC<JailbreakChatboxProps> = ({ point, onClose }) => {
  // Format timestamp to readable date
  const formattedDate = new Date(point.timestamp).toLocaleString();
  
  return (
    <Dialog open={!!point} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Generation {point.generation}, Point {point.pointIndex}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 pr-2">
          {/* Jailbreak Prompt Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-medium">Jailbreak Prompt</h3>
            </div>
            <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
              <p className="whitespace-pre-wrap">{point.jailbreakPrompt}</p>
            </div>
          </div>
          
          {/* Model Response Section */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Model Response</h3>
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-800">
              <p className="whitespace-pre-wrap">{point.modelResponse}</p>
            </div>
          </div>
          
          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
              <span className="text-muted-foreground">Unsafe Score:</span>
              <span className="ml-2 font-medium">{point.unsafePercentage.toFixed(2)}%</span>
            </div>
            <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
              <span className="text-muted-foreground">Timestamp:</span>
              <span className="ml-2 font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JailbreakChatbox;
