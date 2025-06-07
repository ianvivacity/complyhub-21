import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail } from 'lucide-react';
import { useState } from 'react';

export const TeamMembers = () => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  
  const isAdmin = organisationMember?.role === 'admin';

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organisation_members')
        .select('*')
        .eq('organisation_id', organisationMember?.organisation_id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!organisationMember?.organisation_id
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, newRole }: { memberId: string, newRole: 'admin' | 'member' }) => {
      const { error } = await supabase
        .from('organisation_members')
        .update({ role: newRole })
        .eq('id', memberId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Success",
        description: "Member role updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive"
      });
    }
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string, role: 'admin' | 'member' }) => {
      const { data, error } = await supabase.rpc('send_invitation', {
        _email: email,
        _organisation_id: organisationMember?.organisation_id
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invitation sent successfully"
      });
      setInviteEmail('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    }
  });

  const handleRoleUpdate = (memberId: string, newRole: 'admin' | 'member') => {
    updateRoleMutation.mutate({ memberId, newRole });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    inviteMutation.mutate({ 
      email: inviteEmail, 
      role: inviteRole 
    });
  };

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'parent' : 'child';
  };

  const getRoleValue = (label: string) => {
    return label === 'parent' ? 'admin' : 'member';
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-[#7030a0]" />
        <h1 className="text-3xl font-bold">Team Members</h1>
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: '18px' }}>Invite New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="invite-role">Role</Label>
                <Select value={getRoleLabel(inviteRole)} onValueChange={(value) => setInviteRole(getRoleValue(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: '18px' }}>Current Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{member.full_name || member.email}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    member.role === 'admin' 
                      ? 'bg-[#ee1878] text-white' 
                      : 'bg-[#01b0f1] text-white'
                  }`}>
                    {getRoleLabel(member.role)}
                  </span>
                  {isAdmin && member.id !== organisationMember?.id && (
                    <Select 
                      value={getRoleLabel(member.role)} 
                      onValueChange={(value) => handleRoleUpdate(member.id, getRoleValue(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
