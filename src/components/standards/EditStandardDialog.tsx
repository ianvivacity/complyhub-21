
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Standard {
  id: string;
  standard_clause: string;
  standard_description: string;
}

interface EditStandardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  standard: Standard | null;
}

export const EditStandardDialog = ({ open, onOpenChange, onSuccess, standard }: EditStandardDialogProps) => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [standardClause, setStandardClause] = useState('');
  const [standardDescription, setStandardDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (standard) {
      setStandardClause(standard.standard_clause);
      setStandardDescription(standard.standard_description);
    }
  }, [standard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationMember?.organisation_id || !standard) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('standards')
        .update({
          standard_clause: standardClause,
          standard_description: standardDescription,
        })
        .eq('id', standard.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Standard updated successfully",
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error updating standard:', error);
      toast({
        title: "Error",
        description: "Failed to update standard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStandardClause('');
    setStandardDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Standard</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="standardClause">Standard Clause</Label>
            <Input
              id="standardClause"
              placeholder="Enter standard clause"
              value={standardClause}
              onChange={(e) => setStandardClause(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="standardDescription">Standard Description</Label>
            <Textarea
              id="standardDescription"
              placeholder="Enter standard description"
              value={standardDescription}
              onChange={(e) => setStandardDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Standard'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
