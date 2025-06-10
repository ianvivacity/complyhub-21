
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, organisationMember, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  const getUserRole = () => {
    return organisationMember?.role || 'member';
  };

  const getRoleStyles = (role: string) => {
    const baseStyles = "px-3 py-1 text-xs font-medium rounded-full shadow-sm";
    switch (role) {
      case 'admin':
        return `${baseStyles} bg-purple-100 text-purple-700`;
      case 'member':
        return `${baseStyles} bg-blue-100 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a 
              href="https://www.vivacity.com.au/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:text-[#ED1878]"
              style={{
                fontWeight: 500,
                fontSize: '15px',
                color: 'black'
              }}
            >
              Powered By Vivacity Coaching And Consulting
            </a>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all"
                  onClick={handleProfileClick}
                >
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url} 
                    alt="Profile picture" 
                  />
                  <AvatarFallback className="text-sm">
                    {organisationMember?.full_name ? 
                      getInitials(organisationMember.full_name) : 
                      <User className="h-4 w-4" />
                    }
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">
                  Welcome, {organisationMember?.full_name || user.email}
                </span>
              </div>
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
