import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Upload, ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 5,
  maxSizeMB = 5 
}: ImageUploadProps) {
  const { t } = useTranslation();
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validateFile = (file: File): string | null => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        return t('imageUpload.errors.notImage');
      }

      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return t('imageUpload.errors.tooLarge', { size: maxSizeMB });
      }

      return null;
    };

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    const errors: string[] = [];

    // Check if adding these files would exceed the max
    if (images.length + files.length > maxImages) {
      errors.push(t('imageUpload.errors.tooMany', { max: maxImages }));
      return;
    }

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        return;
      }

      newFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (newFiles.length > 0) {
      onChange([...images, ...newFiles]);
    }
  }, [images, onChange, maxImages, maxSizeMB, previews, t]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onChange(newImages);
    setPreviews(newPreviews);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleChange}
        />
        
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t('imageUpload.dragDrop')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('imageUpload.orClick')}
          </p>
          <Button 
            type="button"
            variant="outline" 
            onClick={handleButtonClick}
            className="mt-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t('imageUpload.selectFiles')}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          {t('imageUpload.limits', { max: maxImages, size: maxSizeMB })}
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                {images[index].name}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
