
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Users, Trash2, UserCheck, Crown, Building2, Hash, Mail, Phone } from 'lucide-react';
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

interface Organisation {
  id: string;
  name: string;
  rto_id?: string;
  contact_email?: string;
  contact_number?: string;
}

export const TeamMembers = () => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = organisationMember?.role === 'admin';

  const fetchOrganisation = async () => {
    if (!organisationMember?.organisation_id) return;

    try {
      const { data, error } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', organisationMember.organisation_id)
        .single();

      if (error) throw error;
      setOrganisation(data);
    } catch (error) {
      console.error('Error fetching organisation:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organisation details",
        variant: "destructive",
      });
    }
  };

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
    fetchOrganisation();
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
      console.log('Attempting to delete member:', memberId);
      
      const { error } = await supabase
        .from('organisation_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error deleting member:', error);
        throw error;
      }

      console.log('Successfully deleted member');

      toast({
        title: "Success",
        description: "Team member removed successfully",
      });

      // Refresh the team members list
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member. You may not have permission to perform this action.",
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

  const stats = [
    { 
      label: 'Total Members', 
      value: teamMembers.length.toString(), 
      subtitle: 'Active team members', 
      icon: Users,
      iconColor: 'text-blue-500'
    },
    { 
      label: 'Administrators', 
      value: teamMembers.filter(m => m.role === 'admin').length.toString(), 
      subtitle: 'Admin users', 
      icon: Crown,
      iconColor: 'text-purple-500'
    },
    { 
      label: 'Regular Members', 
      value: teamMembers.filter(m => m.role === 'member').length.toString(), 
      subtitle: 'Standard users', 
      icon: UserCheck,
      iconColor: 'text-green-500'
    }
  ];

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

      {/* Organisation Information Card */}
      {organisation && (
        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organisation Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Organisation</div>
                  <div className="text-sm text-gray-900" style={{ fontSize: '14px' }}>
                    {organisation.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Hash className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-gray-600">RTO ID</div>
                  <div className="text-sm text-gray-900" style={{ fontSize: '14px' }}>
                    {organisation.rto_id || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Email</div>
                  <div className="text-sm text-gray-900" style={{ fontSize: '14px' }}>
                    {organisation.contact_email || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Phone Number</div>
                  <div className="text-sm text-gray-900" style={{ fontSize: '14px' }}>
                    {organisation.contact_number || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.subtitle}</div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
                                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {member.full_name || member.email} from the team? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Member
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
