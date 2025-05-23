import React from 'react';
import { Progress } from "../ui/progress";

interface AccessibilityFeaturesProps {
  children: React.ReactNode;
}

// Higher-order component to add accessibility features
export const AccessibilityFeatures: React.FC<AccessibilityFeaturesProps> = ({ children }) => {
  // Skip to content functionality
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // When Tab is pressed at the start of the page
      if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.createElement('div');
        skipLink.className = 'fixed top-4 left-4 z-50 transition-opacity duration-200';
        skipLink.innerHTML = `
          <a href="#main-content" 
             class="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg focus:outline-none">
            Skip to content
          </a>
        `;
        document.body.appendChild(skipLink);
        
        // Remove when focus moves away
        const handleFocusOut = () => {
          document.body.removeChild(skipLink);
          document.removeEventListener('focusout', handleFocusOut);
        };
        
        document.addEventListener('focusout', handleFocusOut);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Announce status changes to screen readers
  const [announcements, setAnnouncements] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    // Listen for custom events for screen reader announcements
    const handleAnnouncement = (e: CustomEvent) => {
      setAnnouncements(prev => [...prev, e.detail.message]);
      
      // Clear announcements after they've been read
      setTimeout(() => {
        setAnnouncements(prev => prev.filter(msg => msg !== e.detail.message));
      }, 3000);
    };
    
    document.addEventListener('announce', handleAnnouncement as EventListener);
    return () => {
      document.removeEventListener('announce', handleAnnouncement as EventListener);
    };
  }, []);
  
  // Helper function to announce messages to screen readers
  React.useEffect(() => {
    // Add to global window object
    (window as any).announce = (message: string) => {
      const event = new CustomEvent('announce', { detail: { message } });
      document.dispatchEvent(event);
    };
    
    return () => {
      delete (window as any).announce;
    };
  }, []);
  
  return (
    <>
      {/* Visually hidden announcements for screen readers */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcements.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      
      {/* Main content with ID for skip link */}
      <main id="main-content">
        {children}
      </main>
    </>
  );
};

// Focus trap for modals
export const useFocusTrap = (isOpen: boolean) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    // Focus first element when modal opens
    firstElement?.focus();
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);
  
  return containerRef;
};

// Loading indicator with accessibility
export const AccessibleLoading: React.FC<{ loading: boolean; message?: string }> = ({ 
  loading, 
  message = 'Loading...' 
}) => {
  return loading ? (
    <div 
      role="status" 
      aria-live="polite" 
      className="flex flex-col items-center justify-center p-4"
    >
      <Progress value={100} className="w-24 h-2 animate-pulse" />
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  ) : null;
};

export default { AccessibilityFeatures, useFocusTrap, AccessibleLoading };
