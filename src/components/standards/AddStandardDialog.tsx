
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface AddStandardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddStandardDialog = ({ open, onOpenChange }: AddStandardDialogProps) => {
  const [standardClause, setStandardClause] = useState('');
  const [standardDescription, setStandardDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating standard:', { standardClause, standardDescription });
    onOpenChange(false);
    setStandardClause('');
    setStandardDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Standard</DialogTitle>
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
              className="bg-[#7030a0] hover:bg-[#5e2680] text-white"
            >
              Create Standard
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
