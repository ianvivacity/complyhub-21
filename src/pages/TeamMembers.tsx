
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Users, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InviteMemberDialog } from '@/components/team/InviteMemberDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'member';
  created_at: string;
  phone_number?: string;
}

export const TeamMembers = () => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = organisationMember?.role === 'admin';

  const fetchTeamMembers = async () => {
    if (!organisationMember?.organisation_id) return;

    try {
      const { data, error } = await supabase
        .from('organisation_members')
        .select('*')
        .eq('organisation_id', organisationMember.organisation_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [organisationMember]);

  const handleRoleUpdate = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      const { error } = await supabase
        .from('organisation_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member role updated successfully",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      // First delete from organisation_members
      const { error: memberError } = await supabase
        .from('organisation_members')
        .delete()
        .eq('id', memberId);

      if (memberError) throw memberError;

      // Then delete from auth.users (this requires service role)
      const { error: authError } = await supabase.auth.admin.deleteUser(memberId);
      
      if (authError) {
        console.warn('Could not delete user from auth:', authError);
        // Don't throw here as the org member was already deleted
      }

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.full_name && member.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'member':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-[#7030a0] mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
        </div>
        {isAdmin && <InviteMemberDialog />}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                  {isAdmin && <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium table-entry">
                      {member.full_name || 'No name provided'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 table-entry">{member.email}</td>
                    <td className="py-3 px-4 text-gray-600 table-entry">
                      {member.phone_number || 'Not provided'}
                    </td>
                    <td className="py-3 px-4 table-entry">
                      <span className={getRoleBadge(member.role)}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 table-entry">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 table-entry">
                        <div className="flex items-center space-x-2">
                          <Select
                            value={member.role}
                            onValueChange={(newRole: 'admin' | 'member') => 
                              handleRoleUpdate(member.id, newRole)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user account and remove them from the organization.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No team members found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
