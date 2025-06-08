
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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export const Navigation = () => {
  const { organisationMember } = useAuth();
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebar();
  const isAdmin = organisationMember?.role === 'admin';

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
      adminOnly: true
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || isAdmin
  );

  return (
    <nav className={cn(
      "bg-white shadow-sm border-r h-full flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle button */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex justify-center"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="px-4 py-6 flex-1">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                {item.underDevelopment ? (
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      "text-gray-400 cursor-not-allowed"
                    )}
                    title="Under Development"
                  >
                    <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && (
                      <div className="flex-1">
                        <span>{item.name}</span>
                        <div className="text-xs text-gray-400">Under Development</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors border-0",
                      "text-base py-3",
                      isActive
                        ? "bg-gradient-to-r from-[#7130a0] to-[#ed1878] text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
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
      
      {/* Organization info at bottom */}
      {!collapsed && (
        <div className="px-4 py-4 border-t">
          <div className="text-sm font-medium text-gray-600">
            Organization
          </div>
        </div>
      )}
    </nav>
  );
};
