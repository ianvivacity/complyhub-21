
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
  Shield
} from 'lucide-react';

export const Navigation = () => {
  const { organisationMember } = useAuth();
  const location = useLocation();
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
    },
    {
      name: 'General Settings',
      href: '/settings',
      icon: Settings,
      adminOnly: true
    }
  ];

  const filteredMainNavItems = mainNavItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="bg-white shadow-sm border-r h-screen flex flex-col w-64 duration-300" style={{ height: 'auto' }}>
      {/* Logo */}
      <div className="p-4 border-b flex items-center">
        <div className="flex items-center space-x-3 flex-1">
          <Shield className="h-6 w-6 text-[#7030a0]" />
          <h1 className="text-lg font-semibold text-gray-900">
            ComplyHub
          </h1>
        </div>
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
                    "flex items-center px-3 py-2 font-medium rounded-md transition-colors border-0",
                    "py-3",
                    isActive
                      ? "bg-[rgb(243,232,255)] text-[rgb(107,33,168)]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  style={{ fontSize: '15px' }}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
