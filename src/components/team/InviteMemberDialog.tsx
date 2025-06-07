
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const InviteMemberDialog = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { organisationMember } = useAuth();
  const { toast } = useToast();

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organisationMember?.organisation_id) {
      toast({
        title: "Error",
        description: "Organisation information not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Call the edge function to send invitation
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email,
          organisationId: organisationMember.organisation_id,
          organisationName: 'Your Organisation' // You can get this from context if needed
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      });

      // For demo purposes, show the invitation URL
      if (data?.invitationUrl) {
        console.log("Invitation URL:", data.invitationUrl);
        toast({
          title: "Demo Mode",
          description: `Copy this URL to test: ${data.invitationUrl}`,
        });
      }

      setEmail('');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7030a0] hover:bg-[#5e2680] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
