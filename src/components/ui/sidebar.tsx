
import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Basic sidebar components for compatibility
export const Sidebar = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

export const SidebarContent = ({ children }: any) => children;
export const SidebarGroup = ({ children }: any) => children;
export const SidebarGroupContent = ({ children }: any) => children;
export const SidebarGroupLabel = ({ children }: any) => children;
export const SidebarMenu = ({ children }: any) => children;
export const SidebarMenuButton = ({ children, asChild, ...props }: any) => 
  asChild ? children : <button {...props}>{children}</button>;
export const SidebarMenuItem = ({ children }: any) => children;
export const SidebarTrigger = ({ className, ...props }: any) => (
  <button className={className} {...props} />
);
