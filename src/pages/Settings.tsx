
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Upload } from 'lucide-react';

export const Settings = () => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(organisationMember?.full_name || '');
  const [rtoName, setRtoName] = useState(organisationMember?.organisation_name || '');
  const [rtoId, setRtoId] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = organisationMember?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate save operation
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
      setLoading(false);
    }, 1000);
  };

  const handlePasswordChange = () => {
    toast({
      title: "Info",
      description: "Password change functionality would be implemented here",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-[#7030a0]" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdmin && (
              <div>
                <Label htmlFor="avatar">Profile Avatar</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7030a0] file:text-white hover:file:bg-[#5e2680]"
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {isAdmin && (
              <>
                <div>
                  <Label htmlFor="rto-name">RTO Name</Label>
                  <Input
                    id="rto-name"
                    value={rtoName}
                    onChange={(e) => setRtoName(e.target.value)}
                    placeholder="Enter RTO name"
                  />
                </div>

                <div>
                  <Label htmlFor="rto-id">RTO ID</Label>
                  <Input
                    id="rto-id"
                    value={rtoId}
                    onChange={(e) => setRtoId(e.target.value)}
                    placeholder="Enter RTO ID"
                  />
                </div>
              </>
            )}

            <div className="pt-4 space-y-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#7030a0] hover:bg-[#5e2680] text-white"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handlePasswordChange}
                className="ml-2"
              >
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
