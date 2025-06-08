
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';

export const Header = () => {
  const { user, organisationMember, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserRole = () => {
    return organisationMember?.role || 'member';
  };

  const getRoleStyles = (role: string) => {
    const baseStyles = "px-3 py-1 text-xs font-medium rounded-full shadow-sm";
    switch (role) {
      case 'admin':
        return `${baseStyles} bg-purple-100 text-purple-800`;
      case 'member':
        return `${baseStyles} bg-blue-100 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-[#7030a0]" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              Compliance Management Tracker <span className="text-sm font-normal">Powered By Vivacity Coaching and Consulting</span>
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
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
