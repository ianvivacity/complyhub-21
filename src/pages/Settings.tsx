
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Edit, Building, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrganisationData {
  id: string;
  name: string;
  rto_id: string | null;
  contact_email: string | null;
  contact_number: string | null;
  branding_color: string | null;
}

export const Settings = () => {
  const { organisationMember, user } = useAuth();
  const { toast } = useToast();
  const [organisationData, setOrganisationData] = useState<OrganisationData | null>(null);
  const [memberData, setMemberData] = useState({
    full_name: '',
    phone_number: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = organisationMember?.role === 'admin';

  const fetchOrganisationData = async () => {
    if (!organisationMember?.organisation_id) return;

    try {
      const { data, error } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', organisationMember.organisation_id)
        .single();

      if (error) throw error;
      setOrganisationData(data);
    } catch (error) {
      console.error('Error fetching organisation data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organisation data",
        variant: "destructive",
      });
    }
  };

  const fetchMemberData = async () => {
    if (!organisationMember) return;

    setMemberData({
      full_name: organisationMember.full_name || '',
      phone_number: organisationMember.phone_number || '',
      email: organisationMember.email
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchOrganisationData(), fetchMemberData()]);
      setLoading(false);
    };
    
    fetchData();
  }, [organisationMember]);

  const handleOrganisationUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationData || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('organisations')
        .update({
          name: organisationData.name,
          rto_id: organisationData.rto_id,
          contact_email: organisationData.contact_email,
          contact_number: organisationData.contact_number,
          branding_color: organisationData.branding_color
        })
        .eq('id', organisationData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organisation settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating organisation:', error);
      toast({
        title: "Error",
        description: "Failed to update organisation settings",
        variant: "destructive",
      });
    }
  };

  const handleMemberUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationMember) return;

    try {
      const { error } = await supabase
        .from('organisation_members')
        .update({
          full_name: memberData.full_name,
          phone_number: memberData.phone_number
        })
        .eq('id', organisationMember.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <SettingsIcon className="h-8 w-8 text-[#7030a0] mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organisation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Building className="h-5 w-5 mr-2" />
              Organisation Settings
              {!isAdmin && <span className="ml-2 text-sm text-gray-500">(View Only)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrganisationUpdate} className="space-y-4">
              <div>
                <Label htmlFor="org-name">Organisation Name</Label>
                <Input
                  id="org-name"
                  value={organisationData?.name || ''}
                  onChange={(e) => setOrganisationData(prev => prev ? { ...prev, name: e.target.value } : null)}
                  disabled={!isAdmin}
                  className={!isAdmin ? "bg-gray-100" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="org-id">Organisation ID</Label>
                <Input
                  id="org-id"
                  value={organisationData?.rto_id || ''}
                  onChange={(e) => setOrganisationData(prev => prev ? { ...prev, rto_id: e.target.value } : null)}
                  disabled={!isAdmin}
                  className={!isAdmin ? "bg-gray-100" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={organisationData?.contact_email || ''}
                  onChange={(e) => setOrganisationData(prev => prev ? { ...prev, contact_email: e.target.value } : null)}
                  disabled={!isAdmin}
                  className={!isAdmin ? "bg-gray-100" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="contact-number">Contact Number</Label>
                <Input
                  id="contact-number"
                  value={organisationData?.contact_number || ''}
                  onChange={(e) => setOrganisationData(prev => prev ? { ...prev, contact_number: e.target.value } : null)}
                  disabled={!isAdmin}
                  className={!isAdmin ? "bg-gray-100" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="branding-color">Branding Color (Hex Code)</Label>
                <Input
                  id="branding-color"
                  placeholder="#7130A0"
                  value={organisationData?.branding_color || ''}
                  onChange={(e) => setOrganisationData(prev => prev ? { ...prev, branding_color: e.target.value } : null)}
                  disabled={!isAdmin}
                  className={!isAdmin ? "bg-gray-100" : ""}
                />
              </div>
              
              {isAdmin && (
                <Button type="submit" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Organisation Settings
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Member Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="h-5 w-5 mr-2" />
              Member Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Form */}
            <form onSubmit={handleMemberUpdate} className="space-y-4">
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={memberData.full_name}
                  onChange={(e) => setMemberData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  value={memberData.phone_number}
                  onChange={(e) => setMemberData(prev => ({ ...prev, phone_number: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={memberData.email}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <Button type="submit" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </form>

            {/* Password Form */}
            <form onSubmit={handlePasswordUpdate} className="space-y-4 border-t pt-6">
              <h3 className="font-medium text-gray-900">Change Password</h3>
              
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
