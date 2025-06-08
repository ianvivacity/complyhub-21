
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Database, 
  FileText, 
  Users, 
  Settings,
  BarChart3,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export const Navigation = () => {
  const { organisationMember } = useAuth();
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebar();
  const isAdmin = organisationMember?.role === 'admin';

  const mainNavItems = [
    {
      name: 'Compliance Records',
      href: '/',
      icon: Database,
      adminOnly: false
    },
    {
      name: 'Standards',
      href: '/standards',
      icon: FileText,
      adminOnly: false
    },
    {
      name: 'Team Members',
      href: '/team',
      icon: Users,
      adminOnly: false
    },
    {
      name: 'Analytics & Reporting',
      href: '/analytics',
      icon: BarChart3,
      adminOnly: false
    },
    {
      name: 'Message Center',
      href: '/messages',
      icon: MessageSquare,
      adminOnly: false
    }
  ];

  const settingsItem = {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    adminOnly: true
  };

  const filteredMainNavItems = mainNavItems;

  return (
    <nav className={cn(
      "bg-white shadow-sm border-r h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle button and logo */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3 flex-1">
            <Shield className="h-6 w-6 text-[#7030a0]" />
            <h1 className="text-lg font-semibold text-gray-900">
              ComplyHub
            </h1>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-full">
            <Shield className="h-5 w-5 text-[#7030a0]" />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main navigation */}
      <div className="px-4 py-6 flex-1">
        <ul className="space-y-2">
          {filteredMainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors border-0",
                    "text-base py-3",
                    isActive
                      ? "bg-[rgb(243,232,255)] text-[rgb(107,33,168)]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    collapsed ? "h-6 w-6" : "h-5 w-5", 
                    !collapsed && "mr-3"
                  )} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Settings at bottom */}
      {(!settingsItem.adminOnly || isAdmin) && (
        <div className="px-4 py-4 border-t">
          <Link
            to={settingsItem.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors border-0",
              "text-base py-3",
              location.pathname === settingsItem.href
                ? "bg-[rgb(243,232,255)] text-[rgb(107,33,168)]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Settings className={cn(
              collapsed ? "h-6 w-6" : "h-5 w-5", 
              !collapsed && "mr-3"
            )} />
            {!collapsed && <span>{settingsItem.name}</span>}
          </Link>
        </div>
      )}
    </nav>
  );
};
