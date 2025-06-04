
import React, { useState } from 'react';
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

interface AddComplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddComplianceDialog = ({ open, onOpenChange }: AddComplianceDialogProps) => {
  const [complianceItem, setComplianceItem] = useState('');
  const [status, setStatus] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [standardClause, setStandardClause] = useState('');
  const [notes, setNotes] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState<Date>();
  const [evidence, setEvidence] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating compliance record:', {
      complianceItem,
      status,
      responsiblePerson,
      standardClause,
      notes,
      nextReviewDate,
      evidence
    });
    onOpenChange(false);
    // Reset form
    setComplianceItem('');
    setStatus('');
    setResponsiblePerson('');
    setStandardClause('');
    setNotes('');
    setNextReviewDate(undefined);
    setEvidence(null);
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
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsiblePerson">Responsible Person *</Label>
              <Select value={responsiblePerson} onValueChange={setResponsiblePerson} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carlo-legada">Carlo Legada</SelectItem>
                  <SelectItem value="ian-baterna">Ian Baterna</SelectItem>
                </SelectContent>
              </Select>
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
                <SelectItem value="cs1.05">CS1.05</SelectItem>
                <SelectItem value="cs3.1">CS3.1</SelectItem>
                <SelectItem value="members-only">Members Only</SelectItem>
                <SelectItem value="demo-202">demo 202</SelectItem>
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
              onChange={(e) => setEvidence(e.target.files)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7030a0] file:text-white hover:file:bg-[#5e2680]"
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
              className="bg-[#7030a0] hover:bg-[#5e2680] text-white"
            >
              Create Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
