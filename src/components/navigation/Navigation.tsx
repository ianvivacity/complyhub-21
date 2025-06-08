
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

  const navItems = [
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
      adminOnly: false,
      underDevelopment: true
    },
    {
      name: 'Message Center',
      href: '/messages',
      icon: MessageSquare,
      adminOnly: false,
      underDevelopment: true
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      adminOnly: false
    }
  ];

  return (
    <nav className={cn(
      "bg-white shadow-sm border-r flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )} style={{ height: '93vh' }}>
      {/* Header with logo and toggle */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-[#7030a0] mr-2" />
            <h1 className="text-lg font-semibold text-gray-900">ComplyHub</h1>
          </div>
        )}
        {collapsed && (
          <Shield className="h-6 w-6 text-[#7030a0] mx-auto" />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="px-4 py-6 flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                {item.underDevelopment ? (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors border-0",
                      "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
                      "text-base"
                    )}
                    style={{ fontSize: '16px', paddingTop: '10px', paddingBottom: '10px' }}
                  >
                    <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && (
                      <div className="flex-1">
                        <span>{item.name}</span>
                        <div className="text-xs text-gray-400">Under Development</div>
                      </div>
                    )}
                  </Link>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors border-0",
                      "text-base",
                      isActive
                        ? "bg-gradient-to-r from-[#7130a0] to-[#ed1878] text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    style={{ fontSize: '16px', paddingTop: '10px', paddingBottom: '10px', border: '0px' }}
                  >
                    <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
