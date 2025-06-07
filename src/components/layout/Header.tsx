
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, Bell } from 'lucide-react';

export const Header = () => {
  const { user, organisationMember, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserRole = () => {
    const role = organisationMember?.role || 'member';
    return role === 'admin' ? 'parent' : 'child';
  };

  const getRoleStyles = (role: string) => {
    const baseStyles = "px-3 py-1 text-xs font-medium text-white rounded-full shadow-sm";
    switch (role) {
      case 'parent':
        return `${baseStyles} bg-[#ee1878]`;
      case 'child':
        return `${baseStyles} bg-[#01b0f1]`;
      default:
        return `${baseStyles} bg-gray-500`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-[#7030a0]" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              ComplyHub <span className="text-sm font-normal">Powered By Vivacity Coaching and Consulting</span>
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
              <span className="text-sm text-gray-700">
                Welcome, {organisationMember?.full_name || user.email}
              </span>
              <span className={getRoleStyles(getUserRole())}>
                {getUserRole()}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
