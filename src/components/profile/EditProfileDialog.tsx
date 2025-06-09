
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Phone, Lock } from 'lucide-react';

interface OrganisationMember {
  id: string;
  organisation_id: string;
  role: 'admin' | 'member';
  email: string;
  full_name?: string;
  phone_number?: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organisationMember: OrganisationMember | null;
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  organisationMember
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: organisationMember?.full_name || '',
    phoneNumber: organisationMember?.phone_number || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile information
      if (formData.fullName || formData.phoneNumber) {
        const { error: profileError } = await supabase
          .from('organisation_members')
          .update({
            full_name: formData.fullName || null,
            phone_number: formData.phoneNumber || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', organisationMember?.id);

        if (profileError) {
          throw profileError;
        }
      }

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }

        if (formData.newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword
        });

        if (passwordError) {
          throw passwordError;
        }
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      onOpenChange(false);
      
      // Refresh the page to show updated data
      window.location.reload();

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile Information</h3>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" />
                Full Name
              </Label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2 text-orange-500" />
                Phone Number
              </Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Password Change */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-gray-500">Leave blank if you don't want to change your password</p>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Lock className="h-4 w-4 mr-2 text-red-500" />
                New Password
              </Label>
              <Input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Lock className="h-4 w-4 mr-2 text-red-500" />
                Confirm New Password
              </Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
