
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User, Mail, Phone, Shield, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ProfileSettings = () => {
  const { user, organisationMember } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);

      // Update user metadata with avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Avatar updated successfully!",
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium inline-flex items-center";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'member':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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
    <div className="p-6">
      <div className="flex items-center mb-6">
        <User className="h-8 w-8 text-[#7030a0] mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={avatarUrl || user?.user_metadata?.avatar_url} 
                    alt="Profile picture" 
                  />
                  <AvatarFallback className="text-lg">
                    {organisationMember?.full_name ? 
                      getInitials(organisationMember.full_name) : 
                      <User className="h-8 w-8" />
                    }
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label className="text-sm font-medium">Profile Picture</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new avatar for your profile
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  Full Name
                </Label>
                <Input
                  value={organisationMember?.full_name || 'N/A'}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-green-500" />
                  Email Address
                </Label>
                <Input
                  value={organisationMember?.email || user?.email || 'N/A'}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-orange-500" />
                  Phone Number
                </Label>
                <Input
                  value={organisationMember?.phone_number || 'N/A'}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-purple-500" />
                  Role
                </Label>
                <div className="pt-2">
                  <span className={getRoleBadge(organisationMember?.role || 'member')}>
                    {organisationMember?.role || 'member'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                To update your profile information, please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
