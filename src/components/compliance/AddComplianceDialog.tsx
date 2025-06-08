
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from './FileUpload';

interface AddComplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
}

export const AddComplianceDialog = ({ open, onOpenChange, onSuccess }: AddComplianceDialogProps) => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [complianceItem, setComplianceItem] = useState('');
  const [status, setStatus] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [standardClause, setStandardClause] = useState('');
  const [notes, setNotes] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState<Date>();
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [standards, setStandards] = useState<any[]>([]);

  const isAdmin = organisationMember?.role === 'admin';

  // Set current user as default responsible person for non-admin users
  useEffect(() => {
    if (!isAdmin && organisationMember) {
      setResponsiblePerson(organisationMember.full_name || organisationMember.email);
    }
  }, [isAdmin, organisationMember]);

  // Fetch team members for admin users
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!isAdmin || !organisationMember?.organisation_id) return;

      try {
        const { data, error } = await supabase
          .from('organisation_members')
          .select('id, full_name, email')
          .eq('organisation_id', organisationMember.organisation_id);

        if (error) throw error;
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, [isAdmin, organisationMember]);

  // Fetch standards for dropdown
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const { data, error } = await supabase
          .from('standards')
          .select('*')
          .order('standard_clause', { ascending: true });

        if (error) throw error;
        setStandards(data || []);
      } catch (error) {
        console.error('Error fetching standards:', error);
      }
    };

    fetchStandards();
  }, []);

  const uploadFiles = async (files: File[], recordId: string) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${recordId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('compliance-evidence')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      return fileName;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationMember?.organisation_id) return;

    setLoading(true);
    try {
      // First, create the compliance record
      const { data: recordData, error: recordError } = await supabase
        .from('compliance_records')
        .insert({
          compliance_item: complianceItem,
          compliance_status: status,
          responsible_person: responsiblePerson,
          standard_clause: standardClause,
          notes,
          next_review_date: nextReviewDate ? format(nextReviewDate, 'yyyy-MM-dd') : null,
          organisation_id: organisationMember.organisation_id
        })
        .select()
        .single();

      if (recordError) throw recordError;

      // Upload files if any
      if (evidenceFiles.length > 0) {
        try {
          const filePaths = await uploadFiles(evidenceFiles, recordData.id);
          
          // Update the record with file information
          const { error: updateError } = await supabase
            .from('compliance_records')
            .update({
              file_name: evidenceFiles.map(f => f.name).join(', '),
              file_path: filePaths.join(', ')
            })
            .eq('id', recordData.id);

          if (updateError) throw updateError;
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          toast({
            title: "Warning",
            description: "Record created but some files failed to upload",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Success",
        description: "Compliance record created successfully",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setComplianceItem('');
      setStatus('');
      setResponsiblePerson(isAdmin ? '' : (organisationMember.full_name || organisationMember.email));
      setStandardClause('');
      setNotes('');
      setNextReviewDate(undefined);
      setEvidenceFiles([]);
    } catch (error) {
      console.error('Error creating compliance record:', error);
      toast({
        title: "Error",
        description: "Failed to create compliance record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Compliance Record</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="complianceItem">Compliance Item *</Label>
              <Input
                id="complianceItem"
                placeholder="Enter compliance item"
                value={complianceItem}
                onChange={(e) => setComplianceItem(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Compliance Status *</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Compliant">Compliant</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsiblePerson">Responsible Person *</Label>
              {isAdmin ? (
                <Select value={responsiblePerson} onValueChange={setResponsiblePerson} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.full_name || member.email}>
                        {member.full_name || member.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={responsiblePerson}
                  disabled
                  className="bg-gray-100"
                />
              )}
            </div>
            
            <div>
              <Label>Next Review Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !nextReviewDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextReviewDate ? format(nextReviewDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={nextReviewDate}
                    onSelect={setNextReviewDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="standardClause">Standard Clause *</Label>
            <Select value={standardClause} onValueChange={setStandardClause} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a standard clause" />
              </SelectTrigger>
              <SelectContent>
                {standards.map((standard) => (
                  <SelectItem key={standard.id} value={standard.standard_clause}>
                    {standard.standard_clause}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter detailed notes about this compliance item"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <FileUpload 
            files={evidenceFiles}
            onFilesChange={setEvidenceFiles}
          />
          
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
              className="bg-[#7030a0] hover:bg-[#5e2680] text-white"
            >
              {loading ? 'Creating...' : 'Create Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
