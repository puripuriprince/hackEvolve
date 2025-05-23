import React, { useState, useEffect, useRef } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ExperimentFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    status: string;
    language: string;
    model: string;
    sortBy: string;
  }) => void;
}

export const ExperimentFilters: React.FC<ExperimentFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [language, setLanguage] = useState('all');
  const [model, setModel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Debounce search input
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Set new timeout for debounce
    searchTimeout.current = setTimeout(() => {
      updateFilters(value, status, language, model, sortBy);
    }, 300);
  };
  
  const updateFilters = (
    searchVal: string, 
    statusVal: string, 
    languageVal: string, 
    modelVal: string, 
    sortByVal: string
  ) => {
    if (onFilterChange) {
      onFilterChange({
        search: searchVal,
        status: statusVal,
        language: languageVal,
        model: modelVal,
        sortBy: sortByVal
      });
    }
  };
  
  // Update filters when select values change
  useEffect(() => {
    updateFilters(search, status, language, model, sortBy);
  }, [status, language, model, sortBy]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search experiments..."
          className="pl-8"
          value={search}
          onChange={handleSearchChange}
          aria-label="Search experiments"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[130px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[130px]" aria-label="Filter by language">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="sql">SQL</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-[130px]" aria-label="Filter by model">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            <SelectItem value="gpt4o">GPT-4o</SelectItem>
            <SelectItem value="claude">Claude 3 Opus</SelectItem>
            <SelectItem value="codellama">CodeLlama 70B</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[130px]" aria-label="Sort by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="score">Best Score</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" aria-label="Refresh experiments">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Export experiments data">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentFilters;
