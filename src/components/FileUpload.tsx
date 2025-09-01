import React, { useState, useRef } from 'react';
import { Upload, X, Image, Video, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  type: 'image' | 'video' | 'document';
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  currentUrl,
  onUploadComplete,
  onRemove,
  accept,
  maxSize = 10,
  label
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    if (accept) return accept;
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'document':
        return '.pdf,.doc,.docx';
      default:
        return '*/*';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8" />;
      case 'video':
        return <Video className="w-8 h-8" />;
      default:
        return <File className="w-8 h-8" />;
    }
  };

  const uploadFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `spectacles/${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      onUploadComplete(data.publicUrl);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      {currentUrl ? (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div>
                <p className="text-sm font-medium">File uploaded</p>
                <p className="text-xs text-gray-500 truncate max-w-xs">
                  {currentUrl}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Replace
              </Button>
              {onRemove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          {type === 'image' && (
            <div className="mt-3">
              <img
                src={currentUrl}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}
        </Card>
      ) : (
        <Card
          className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          } ${uploading ? 'opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <div className="flex justify-center mb-3">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900">
              {uploading ? `Uploading ${type}...` : `Upload ${type}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drag and drop or click to select • Max {maxSize}MB
            </p>
          </div>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};
