
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export const useTeamMembers = () => {
  const { organisationMember } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!organisationMember?.organisation_id) return;

      try {
        const { data, error } = await supabase
          .from('organisation_members')
          .select('id, full_name, email, role')
          .eq('organisation_id', organisationMember.organisation_id)
          .order('full_name');

        if (error) throw error;
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [organisationMember]);

  return { teamMembers, loading };
};
