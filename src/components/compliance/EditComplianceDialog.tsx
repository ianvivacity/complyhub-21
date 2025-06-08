
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
import { FileUpload } from './FileUpload';
import { useTeamMembers } from '@/hooks/useTeamMembers';

interface ComplianceRecord {
  id: string;
  compliance_item: string;
  standard_clause: string;
  compliance_status: string;
  responsible_person: string;
  next_review_date: string;
  notes: string;
}

interface EditComplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  record: ComplianceRecord | null;
}

export const EditComplianceDialog = ({ open, onOpenChange, onSuccess, record }: EditComplianceDialogProps) => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const { teamMembers } = useTeamMembers();
  const [complianceItem, setComplianceItem] = useState('');
  const [standardClause, setStandardClause] = useState('');
  const [complianceStatus, setComplianceStatus] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState<Date>();
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = organisationMember?.role === 'admin';
  const memberName = organisationMember?.full_name || organisationMember?.email || '';

  useEffect(() => {
    if (record) {
      setComplianceItem(record.compliance_item);
      setStandardClause(record.standard_clause);
      setComplianceStatus(record.compliance_status);
      setResponsiblePerson(record.responsible_person);
      setNextReviewDate(record.next_review_date ? new Date(record.next_review_date) : undefined);
      setNotes(record.notes || '');
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationMember?.organisation_id || !record) {
      toast({
        title: "Error",
        description: "Organisation or record not found",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let fileNames: string[] = [];
      let filePaths: string[] = [];

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const filePath = `${organisationMember.organisation_id}/${fileName}`;

          console.log('Uploading file:', filePath);

          const { error: uploadError } = await supabase.storage
            .from('compliance-evidence')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(`Failed to upload file: ${uploadError.message}`);
          }

          fileNames.push(file.name);
          filePaths.push(filePath);
        }
      }

      // For members, use their name; for admins, use selected person
      const finalResponsiblePerson = isAdmin ? responsiblePerson : memberName;

      if (!finalResponsiblePerson) {
        throw new Error('Responsible person is required');
      }

      const updateData: any = {
        compliance_item: complianceItem,
        standard_clause: standardClause,
        compliance_status: complianceStatus,
        responsible_person: finalResponsiblePerson,
        next_review_date: nextReviewDate?.toISOString().split('T')[0] || null,
        notes: notes || null,
      };

      // Only update file fields if new files were uploaded
      if (files.length > 0) {
        updateData.file_name = fileNames.join(', ');
        updateData.file_path = filePaths.join(', ');
      }

      console.log('Updating compliance record:', updateData);

      const { error } = await supabase
        .from('compliance_records')
        .update(updateData)
        .eq('id', record.id);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      toast({
        title: "Success",
        description: "Compliance record updated successfully",
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error updating compliance record:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update compliance record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setComplianceItem('');
    setStandardClause('');
    setComplianceStatus('');
    setResponsiblePerson('');
    setNextReviewDate(undefined);
    setNotes('');
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Compliance Record</DialogTitle>
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
            <Label htmlFor="complianceItem">Compliance Item</Label>
            <Input
              id="complianceItem"
              placeholder="Enter compliance item"
              value={complianceItem}
              onChange={(e) => setComplianceItem(e.target.value)}
              required
            />
          </div>
          
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
            <Label htmlFor="complianceStatus">Compliance Status</Label>
            <Select value={complianceStatus} onValueChange={setComplianceStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select compliance status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Compliant">Compliant</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
                <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="responsiblePerson">Responsible Person</Label>
            {isAdmin ? (
              <Select value={responsiblePerson} onValueChange={setResponsiblePerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Select responsible person" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.full_name || member.email}>
                      {member.full_name || member.email} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="responsiblePerson"
                value={memberName}
                readOnly
                className="bg-gray-100"
                placeholder="Your name will be used"
              />
            )}
          </div>
          
          <div>
            <Label>Next Review Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !nextReviewDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nextReviewDate ? format(nextReviewDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={nextReviewDate}
                  onSelect={setNextReviewDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <FileUpload files={files} onFilesChange={setFiles} />
          
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
              disabled={loading || !complianceItem || !standardClause || !complianceStatus || (isAdmin && !responsiblePerson)}
            >
              {loading ? 'Updating...' : 'Update Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
