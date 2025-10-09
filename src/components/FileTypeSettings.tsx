import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, FileType, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FileTypeConfig {
  id: string;
  name: string;
  extensions: string[];
  mimeTypes: string[];
  maxSize: number; // in MB
  description?: string;
}

const getDefaultFileTypes = (t: (key: string) => string): FileTypeConfig[] => [
  {
    id: 'images',
    name: t('fileTypeSettings.defaultTypes.images.name'),
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    mimeTypes: ['image/*'],
    maxSize: 10,
    description: t('fileTypeSettings.defaultTypes.images.description')
  },
  {
    id: 'documents',
    name: t('fileTypeSettings.defaultTypes.documents.name'),
    extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/*'],
    maxSize: 50,
    description: t('fileTypeSettings.defaultTypes.documents.description')
  },
  {
    id: 'spreadsheets',
    name: t('fileTypeSettings.defaultTypes.spreadsheets.name'),
    extensions: ['xls', 'xlsx', 'csv', 'ods'],
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    maxSize: 20,
    description: t('fileTypeSettings.defaultTypes.spreadsheets.description')
  },
  {
    id: 'presentations',
    name: t('fileTypeSettings.defaultTypes.presentations.name'),
    extensions: ['ppt', 'pptx', 'odp'],
    mimeTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    maxSize: 100,
    description: t('fileTypeSettings.defaultTypes.presentations.description')
  },
  {
    id: 'archives',
    name: t('fileTypeSettings.defaultTypes.archives.name'),
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    maxSize: 200,
    description: t('fileTypeSettings.defaultTypes.archives.description')
  },
  {
    id: 'videos',
    name: t('fileTypeSettings.defaultTypes.videos.name'),
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    mimeTypes: ['video/*'],
    maxSize: 500,
    description: t('fileTypeSettings.defaultTypes.videos.description')
  },
  {
    id: 'audio',
    name: t('fileTypeSettings.defaultTypes.audio.name'),
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
    mimeTypes: ['audio/*'],
    maxSize: 100,
    description: t('fileTypeSettings.defaultTypes.audio.description')
  },
  {
    id: 'code',
    name: t('fileTypeSettings.defaultTypes.code.name'),
    extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift'],
    mimeTypes: ['text/javascript', 'text/x-python', 'text/x-java-source', 'text/x-c++src'],
    maxSize: 10,
    description: t('fileTypeSettings.defaultTypes.code.description')
  }
];

interface FileTypeSettingsProps {
  onConfigChange?: (config: FileTypeConfig[]) => void;
  initialConfig?: FileTypeConfig[] | null;
  isAdminMode?: boolean;
}

export default function FileTypeSettings({ 
  onConfigChange, 
  initialConfig, 
  isAdminMode = false 
}: FileTypeSettingsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const DEFAULT_FILE_TYPES = useMemo(() => getDefaultFileTypes(t), [t]);

  const [fileTypes, setFileTypes] = useState<FileTypeConfig[]>([]);
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(new Set());
  const [customType, setCustomType] = useState({
    name: '',
    extensions: '',
    maxSize: 10,
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    if (isAdminMode) {
      setFileTypes(DEFAULT_FILE_TYPES);
      if (initialConfig && initialConfig.length > 0) {
        setEnabledTypes(new Set(initialConfig.map(ft => ft.id)));
      } else if (initialConfig === null) {
        setEnabledTypes(new Set(DEFAULT_FILE_TYPES.map(ft => ft.id)));
      } else {
        setEnabledTypes(new Set());
      }
      setIsInitialized(true);
    } else {
      const savedConfig = localStorage.getItem('fileTypeConfig');
      const savedEnabled = localStorage.getItem('enabledFileTypes');
      
      if (savedConfig) {
        setFileTypes(JSON.parse(savedConfig));
      } else {
        setFileTypes(DEFAULT_FILE_TYPES);
      }

      if (savedEnabled) {
        setEnabledTypes(new Set(JSON.parse(savedEnabled)));
      } else {
        setEnabledTypes(new Set(['images', 'documents']));
      }
      setIsInitialized(true);
    }
  }, [isAdminMode, initialConfig, isInitialized, DEFAULT_FILE_TYPES]);

  useEffect(() => {
    if (!isAdminMode) {
      localStorage.setItem('fileTypeConfig', JSON.stringify(fileTypes));
      localStorage.setItem('enabledFileTypes', JSON.stringify(Array.from(enabledTypes)));
    }
    
    if (onConfigChange) {
      const enabledFileTypes = fileTypes.filter(type => enabledTypes.has(type.id));
      onConfigChange(enabledFileTypes);
    }
  }, [fileTypes, enabledTypes, onConfigChange, isAdminMode]);

  const toggleFileType = (typeId: string) => {
    setEnabledTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(typeId)) {
        newSet.delete(typeId);
      } else {
        newSet.add(typeId);
      }
      return newSet;
    });
  };

  const addCustomType = () => {
    if (!customType.name || !customType.extensions) return;

    const extensions = customType.extensions.split(',').map(ext => ext.trim().toLowerCase());
    const newType: FileTypeConfig = {
      id: `custom-${Date.now()}`,
      name: customType.name,
      extensions,
      mimeTypes: extensions.map(ext => `application/${ext}`),
      maxSize: customType.maxSize,
      description: customType.description
    };

    setFileTypes(prev => [...prev, newType]);
    setCustomType({ name: '', extensions: '', maxSize: 10, description: '' });
    setShowAddForm(false);
  };

  const removeCustomType = (typeId: string) => {
    setFileTypes(prev => prev.filter(type => type.id !== typeId));
    setEnabledTypes(prev => {
      const newSet = new Set(prev);
      newSet.delete(typeId);
      return newSet;
    });
  };

  const getTotalMaxFileSize = () => {
    return Math.max(0, ...fileTypes.filter(type => enabledTypes.has(type.id)).map(type => type.maxSize));
  };

  const getAcceptString = () => {
    const enabledFileTypes = fileTypes.filter(type => enabledTypes.has(type.id));
    const mimeTypes = enabledFileTypes.flatMap(type => type.mimeTypes);
    const extensions = enabledFileTypes.flatMap(type => type.extensions.map(ext => `.${ext}`));
    return [...new Set([...mimeTypes, ...extensions])].join(',');
  };

  if (!user) return null;

  if (isAdminMode && !isInitialized) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileType className="h-5 w-5" />
          {t('fileTypeSettings.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            {t('fileTypeSettings.description')}
          </div>

          {fileTypes.map((fileType) => (
            <div
              key={fileType.id}
              className={`p-4 border rounded-lg transition-colors ${
                enabledTypes.has(fileType.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={enabledTypes.has(fileType.id)}
                      onChange={() => toggleFileType(fileType.id)}
                      className="rounded"
                    />
                    <h4 className="font-medium">{fileType.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {t('fileTypeSettings.maxSize', { size: fileType.maxSize })}
                    </Badge>
                  </div>
                  
                  {fileType.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {fileType.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {fileType.extensions.map((ext) => (
                      <Badge key={ext} variant="secondary" className="text-xs">
                        .{ext}
                      </Badge>
                    ))}
                  </div>
                </div>

                {fileType.id.startsWith('custom-') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomType(fileType.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          {!showAddForm ? (
            <Button
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('fileTypeSettings.addCustomType')}
            </Button>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customName">{t('fileTypeSettings.form.nameLabel')}</Label>
                  <Input
                    id="customName"
                    value={customType.name}
                    onChange={(e) => setCustomType(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('fileTypeSettings.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="customSize">{t('fileTypeSettings.form.maxSizeLabel')}</Label>
                  <Input
                    id="customSize"
                    type="number"
                    value={customType.maxSize}
                    onChange={(e) => setCustomType(prev => ({ ...prev, maxSize: parseInt(e.target.value) || 10 }))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customExtensions">{t('fileTypeSettings.form.extensionsLabel')}</Label>
                <Input
                  id="customExtensions"
                  value={customType.extensions}
                  onChange={(e) => setCustomType(prev => ({ ...prev, extensions: e.target.value }))}
                  placeholder={t('fileTypeSettings.form.extensionsPlaceholder')}
                />
              </div>
              
              <div>
                <Label htmlFor="customDescription">{t('fileTypeSettings.form.descriptionLabel')}</Label>
                <Input
                  id="customDescription"
                  value={customType.description}
                  onChange={(e) => setCustomType(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('fileTypeSettings.form.descriptionPlaceholder')}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addCustomType} disabled={!customType.name || !customType.extensions}>
                  {t('fileTypeSettings.form.addButton')}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  {t('fileTypeSettings.form.cancelButton')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {enabledTypes.size > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">{t('fileTypeSettings.currentSettings.title')}</h5>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t('fileTypeSettings.currentSettings.enabledTypes')} <strong>{enabledTypes.size}</strong></p>
              <p>{t('fileTypeSettings.currentSettings.maxFileSize')} <strong>{getTotalMaxFileSize()} MB</strong></p>
              <details className="mt-2">
                <summary className="cursor-pointer hover:text-foreground">
                  {t('fileTypeSettings.currentSettings.acceptString')}
                </summary>
                <code className="block mt-1 p-2 bg-muted rounded text-xs break-all">
                  {getAcceptString()}
                </code>
              </details>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

let cachedFileTypes: FileTypeConfig[] | null = null;

export async function getFileTypeConfig(): Promise<FileTypeConfig[]> {
  if (cachedFileTypes) {
    return cachedFileTypes;
  }

  try {
    const response = await fetch('/v1/admin/settings');
    if (response.ok) {      const data = await response.json();
      if (data.allowedFileTypes && Array.isArray(data.allowedFileTypes)) {
        cachedFileTypes = data.allowedFileTypes;
        return cachedFileTypes;
      }
    }
  } catch (error) {
    console.error('Error fetching global file types:', error);
  }
  
  // Fallback to default settings - Note: these will be untranslated here.
  // The component will handle the translation.
  cachedFileTypes = getDefaultFileTypes((key) => key); // Pass a dummy t function
  return cachedFileTypes;
}