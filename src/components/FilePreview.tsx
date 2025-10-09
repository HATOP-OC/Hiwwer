import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Send, FileText, FileImage, FileVideo, FileAudio, FileArchive, FileCode } from 'lucide-react';

interface FilePreviewProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  isUploading?: boolean;
}

export default function FilePreview({ file, isOpen, onClose, onSend, isUploading = false }: FilePreviewProps) {
  const { t } = useTranslation();

  if (!file) return null;

  const fileSize = (file.size / 1024 / 1024).toFixed(2);
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
  const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension);
  const isAudio = ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(fileExtension);
  const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension);
  const isCode = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift'].includes(fileExtension);

  let FileIcon = FileText;
  if (isImage) FileIcon = FileImage;
  else if (isVideo) FileIcon = FileVideo;
  else if (isAudio) FileIcon = FileAudio;
  else if (isArchive) FileIcon = FileArchive;
  else if (isCode) FileIcon = FileCode;

  const previewUrl = isImage || isVideo ? URL.createObjectURL(file) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            {t('filePreview.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileIcon className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium truncate max-w-xs" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {fileExtension.toUpperCase()}
                  </Badge>
                  <span>{fileSize} {t('filePreview.mb')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center p-4 bg-muted/50 rounded-lg min-h-[200px] items-center">
            {isImage && previewUrl ? (
              <img
                src={previewUrl}
                alt={file.name}
                className="max-w-full max-h-80 rounded-lg object-contain"
                onLoad={() => previewUrl && URL.revokeObjectURL(previewUrl)}
              />
            ) : isVideo && previewUrl ? (
              <video
                src={previewUrl}
                className="max-w-full max-h-80 rounded-lg"
                controls
                onLoadedData={() => previewUrl && URL.revokeObjectURL(previewUrl)}
              />
            ) : isAudio ? (
              <div className="text-center">
                <FileAudio className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t('filePreview.audioPlaceholder')}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <FileIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t('filePreview.defaultPlaceholder')}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              <X className="h-4 w-4 mr-2" />
              {t('filePreview.cancel')}
            </Button>
            <Button onClick={onSend} disabled={isUploading}>
              <Send className="h-4 w-4 mr-2" />
              {isUploading ? t('filePreview.sending') : t('filePreview.send')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}