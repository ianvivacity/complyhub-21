
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Database, 
  FileText, 
  Users, 
  Settings,
  FolderOpen,
  MessageSquare,
  Shield,
  Menu,
  X
} from 'lucide-react';

export const Navigation = () => {
  const { organisationMember } = useAuth();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatAustralianDateTime = (date: Date) => {
    return date.toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', ',');
  };

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
      name: 'Documents Directories',
      href: '/analytics',
      icon: FolderOpen,
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
    name: 'Profile Settings',
    href: '/settings',
    icon: Settings,
    adminOnly: false
  };

  const filteredMainNavItems = mainNavItems.filter(item => !item.adminOnly);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={cn(
      "bg-white shadow-sm border-r h-screen flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 flex-1">
            <Shield className="h-6 w-6 text-[#7030a0]" />
            <h1 className="text-lg font-semibold gradient-text">
              ComplyHub
            </h1>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="h-6 w-6 text-gray-600" />
          ) : (
            <X className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Australian Date/Time Display */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b">
          <div className="text-center" style={{ fontSize: '15px', color: '#020817' }}>
            AU: {formatAustralianDateTime(currentTime)}
          </div>
        </div>
      )}

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
                    "flex items-center font-medium rounded-md border-0",
                    isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-3",
                    isActive
                      ? "bg-[rgb(243,232,255)] text-[rgb(107,33,168)]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  style={{ fontSize: '15px' }}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn(
                    "h-6 w-6 flex-shrink-0",
                    isCollapsed ? "" : "mr-3"
                  )} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Settings at the bottom */}
      <div className="px-4 pb-6 border-t pt-4">
        <ul>
          <li>
            <Link
              to={settingsItem.href}
              className={cn(
                "flex items-center font-medium rounded-md border-0",
                isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-3",
                location.pathname === settingsItem.href
                  ? "bg-[rgb(243,232,255)] text-[rgb(107,33,168)]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              style={{ fontSize: '15px' }}
              title={isCollapsed ? settingsItem.name : undefined}
            >
              <Settings className={cn(
                "h-6 w-6 flex-shrink-0",
                isCollapsed ? "" : "mr-3"
              )} />
              {!isCollapsed && <span>{settingsItem.name}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
