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
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationMember?.organisation_id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('compliance_records')
        .insert({
          compliance_item: complianceItem,
          compliance_status: status,
          responsible_person: responsiblePerson,
          standard_clause: standardClause,
          notes,
          next_review_date: nextReviewDate ? format(nextReviewDate, 'yyyy-MM-dd') : null,
          organisation_id: organisationMember.organisation_id
        });

      if (error) throw error;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setEvidenceFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
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

          <div>
            <Label htmlFor="evidence">Upload Evidence (Multiple files allowed)</Label>
            <Input
              id="evidence"
              type="file"
              multiple
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7030a0] file:text-white hover:file:bg-[#5e2680]"
            />
            
            {/* Display uploaded files */}
            {evidenceFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label className="text-sm font-medium">Selected Files:</Label>
                {evidenceFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
