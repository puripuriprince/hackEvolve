import React from 'react';
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal, Download, Trash, Play, Pause, Share2 } from "lucide-react";

interface BatchActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
}

export const BatchActions: React.FC<BatchActionsProps> = ({ 
  selectedCount, 
  onAction 
}) => {
  return (
    <div className="flex items-center gap-2" aria-live="polite">
      {selectedCount > 0 ? (
        <>
          <span className="text-sm font-medium">{selectedCount} selected</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => onAction('start')}
            aria-label={`Start ${selectedCount} selected experiments`}
          >
            <Play className="h-3.5 w-3.5" />
            Start
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => onAction('pause')}
            aria-label={`Pause ${selectedCount} selected experiments`}
          >
            <Pause className="h-3.5 w-3.5" />
            Pause
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => onAction('export')}
            aria-label={`Export ${selectedCount} selected experiments`}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-red-500 hover:text-red-600"
            onClick={() => onAction('delete')}
            aria-label={`Delete ${selectedCount} selected experiments`}
          >
            <Trash className="h-3.5 w-3.5" />
            Delete
          </Button>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">Select experiments to perform batch actions</span>
      )}
    </div>
  );
};

interface SelectableExperimentProps {
  id: number;
  name: string;
  selected: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onAction: (id: number, action: string) => void;
}

export const SelectableExperiment: React.FC<SelectableExperimentProps> = ({
  id,
  name,
  selected,
  onSelect,
  onAction
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border rounded-md">
      <Checkbox 
        id={`experiment-${id}`} 
        checked={selected}
        onCheckedChange={(checked) => onSelect(id, !!checked)}
        aria-label={`Select ${name}`}
      />
      <label 
        htmlFor={`experiment-${id}`}
        className="flex-1 text-sm font-medium cursor-pointer"
      >
        {name}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onAction(id, 'start')}>
            <Play className="mr-2 h-4 w-4" />
            <span>Start</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction(id, 'pause')}>
            <Pause className="mr-2 h-4 w-4" />
            <span>Pause</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction(id, 'share')}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction(id, 'export')}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onAction(id, 'delete')}
            className="text-red-500 focus:text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default { BatchActions, SelectableExperiment };
