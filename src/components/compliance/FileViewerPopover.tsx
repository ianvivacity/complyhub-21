
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileViewerPopoverProps {
  filePaths: string[];
  fileNames: string[];
}

export const FileViewerPopover = ({ filePaths, fileNames }: FileViewerPopoverProps) => {
  const { toast } = useToast();

  const handleViewFile = async (filePath: string, fileName: string) => {
    try {
      console.log('Downloading file:', filePath, fileName);
      
      const { data, error } = await supabase.storage
        .from('compliance-evidence')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      // Create a blob URL and open in new tab
      const url = URL.createObjectURL(data);
      window.open(url, '_blank');
      
      // Clean up the URL after a delay to allow the tab to load
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      toast({
        title: "Success",
        description: "File opened successfully",
      });
    } catch (error) {
      console.error('Error opening file:', error);
      toast({
        title: "Error",
        description: "Failed to open file",
        variant: "destructive",
      });
    }
  };

  if (fileNames.length === 0 || filePaths.length === 0) {
    return <span className="text-gray-400 text-sm">No files</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
        >
          <Eye className="h-4 w-4 mr-1" />
          View ({fileNames.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900 mb-3">Evidence Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {fileNames.map((fileName, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate" title={fileName}>
                    {fileName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewFile(filePaths[index], fileName)}
                  className="text-blue-600 hover:text-blue-700 p-1 h-auto ml-2"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
