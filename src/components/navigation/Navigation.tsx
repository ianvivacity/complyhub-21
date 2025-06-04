
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Database, 
  FileText, 
  Users, 
  Settings, 
  BarChart3 
} from 'lucide-react';

export const Navigation = () => {
  const { organisationMember } = useAuth();
  const location = useLocation();
  const isAdmin = organisationMember?.role === 'admin';

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
      adminOnly: false
    },
    {
      name: 'Compliance Records',
      href: '/compliance',
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
    <nav className="bg-white shadow-sm border-r">
      <div className="px-4 py-6">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
