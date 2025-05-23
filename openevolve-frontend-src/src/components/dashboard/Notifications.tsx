import React, { useEffect, useRef } from 'react';
import { Button } from "../ui/button";
import { AlertTriangle, Bell, Download, Share2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface NotificationsProps {
  onClear?: () => void;
}

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'completion',
    message: 'Sorting Algorithm Optimization completed with score 0.87',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: 2,
    type: 'alert',
    message: 'API usage reached 80% of monthly quota',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 3,
    type: 'system',
    message: 'System update scheduled for tomorrow at 2:00 AM UTC',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  }
];

export const Notifications: React.FC<NotificationsProps> = ({ onClear }) => {
  const { toast } = useToast();
  const notificationShown = useRef<Set<number>>(new Set());
  
  // Show toast notifications for new items
  useEffect(() => {
    mockNotifications.forEach(notification => {
      if (!notificationShown.current.has(notification.id)) {
        // Only show notifications that are "new" (less than 10 minutes old)
        const notificationTime = new Date(notification.timestamp).getTime();
        const tenMinutesAgo = Date.now() - 1000 * 60 * 10;
        
        if (notificationTime > tenMinutesAgo) {
          toast({
            title: notification.type === 'alert' ? 'Alert' : 
                  notification.type === 'completion' ? 'Experiment Completed' : 'System Notification',
            description: notification.message,
            variant: notification.type === 'alert' ? 'destructive' : 'default',
          });
        }
        
        notificationShown.current.add(notification.id);
      }
    });
  }, [toast]);
  
  // Format relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'completion':
        return <Download className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };
  
  return (
    <div className="w-full max-w-md" role="region" aria-label="Notifications">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </div>
      
      <div className="space-y-4">
        {mockNotifications.map(notification => (
          <div 
            key={notification.id} 
            className="flex items-start gap-3 p-3 border rounded-lg transition-colors hover:bg-muted/50"
            role="listitem"
          >
            <div className="mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getRelativeTime(notification.timestamp)}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Share notification">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
