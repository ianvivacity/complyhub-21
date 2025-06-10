
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Navigation } from '../navigation/Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(256);

  // Listen for sidebar width changes
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('nav');
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    };

    // Initial measurement
    handleResize();

    // Use ResizeObserver to watch for sidebar width changes
    const sidebar = document.querySelector('nav');
    if (sidebar) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(sidebar);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 z-40">
        <Navigation />
      </div>
      
      {/* Main content area */}
      <div 
        className="flex-1 flex flex-col"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Fixed Header */}
        <div 
          className="fixed top-0 right-0 z-30"
          style={{ left: `${sidebarWidth}px` }}
        >
          <Header />
        </div>
        
        {/* Scrollable content */}
        <main className="flex-1 pt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
