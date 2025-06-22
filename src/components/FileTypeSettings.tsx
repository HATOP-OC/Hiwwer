import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, FileType, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFileTypes } from '@/contexts/FileTypeContext';

interface FileTypeConfig {
  id: string;
  name: string;
  extensions: string[];
  mimeTypes: string[];
  maxSize: number; // in MB
  description?: string;
}

const DEFAULT_FILE_TYPES: FileTypeConfig[] = [
  {
    id: 'images',
    name: 'Зображення',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    mimeTypes: ['image/*'],
    maxSize: 10,
    description: 'Файли зображень (JPG, PNG, GIF, WebP, SVG)'
  },
  {
    id: 'documents',
    name: 'Документи',
    extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/*'],
    maxSize: 50,
    description: 'Текстові документи (PDF, DOC, DOCX, TXT, RTF, ODT)'
  },
  {
    id: 'spreadsheets',
    name: 'Таблиці',
    extensions: ['xls', 'xlsx', 'csv', 'ods'],
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    maxSize: 20,
    description: 'Таблиці (XLS, XLSX, CSV, ODS)'
  },
  {
    id: 'presentations',
    name: 'Презентації',
    extensions: ['ppt', 'pptx', 'odp'],
    mimeTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    maxSize: 100,
    description: 'Презентації (PPT, PPTX, ODP)'
  },
  {
    id: 'archives',
    name: 'Архіви',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    maxSize: 200,
    description: 'Архіви (ZIP, RAR, 7Z, TAR, GZ)'
  },
  {
    id: 'videos',
    name: 'Відео',
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    mimeTypes: ['video/*'],
    maxSize: 500,
    description: 'Відеофайли (MP4, AVI, MOV, WMV, FLV, WebM)'
  },
  {
    id: 'audio',
    name: 'Аудіо',
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
    mimeTypes: ['audio/*'],
    maxSize: 100,
    description: 'Аудіофайли (MP3, WAV, FLAC, AAC, OGG)'
  },
  {
    id: 'code',
    name: 'Код',
    extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift'],
    mimeTypes: ['text/javascript', 'text/x-python', 'text/x-java-source', 'text/x-c++src'],
    maxSize: 10,
    description: 'Файли коду (JS, TS, Python, Java, C++, та інші)'
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
  const { user } = useAuth();
  const [fileTypes, setFileTypes] = useState<FileTypeConfig[]>([]);
  const [enabledTypes, setEnabledTypes] = useState<Set<string>>(new Set());
  const [customType, setCustomType] = useState({
    name: '',
    extensions: '',
    maxSize: 10,
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Стан для відстеження ініціалізації
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ініціалізувати тільки один раз
    if (isInitialized) return;

    if (isAdminMode) {
      // В режимі адміністратора завжди показуємо всі доступні типи файлів
      setFileTypes(DEFAULT_FILE_TYPES);
      
      if (initialConfig && initialConfig.length > 0) {
        // Якщо є збережена конфігурація, встановлюємо тільки дозволені типи як активні
        setEnabledTypes(new Set(initialConfig.map(ft => ft.id)));
      } else if (initialConfig === null) {
        // Якщо немає збереженої конфігурації (null), всі типи активні за замовчуванням
        setEnabledTypes(new Set(DEFAULT_FILE_TYPES.map(ft => ft.id)));
      } else {
        // Якщо порожній масив [], жоден тип не активний
        setEnabledTypes(new Set());
      }
      setIsInitialized(true);
    } else if (!isAdminMode) {
      // Для звичайних користувачів зчитуємо глобальні налаштування з API
      // або використовуємо localStorage як fallback
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
        setEnabledTypes(new Set(['images', 'documents'])); // Дефолтно увімкнути зображення та документи
      }
      setIsInitialized(true);
    }
  }, [isAdminMode, initialConfig, isInitialized]);

  useEffect(() => {
    // Зберігати конфігурацію в localStorage тільки якщо не адмін режим
    if (!isAdminMode) {
      localStorage.setItem('fileTypeConfig', JSON.stringify(fileTypes));
      localStorage.setItem('enabledFileTypes', JSON.stringify(Array.from(enabledTypes)));
    }
    
    // Викликати callback якщо є
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
    return Math.max(...fileTypes.filter(type => enabledTypes.has(type.id)).map(type => type.maxSize));
  };

  const getAcceptString = () => {
    const enabledFileTypes = fileTypes.filter(type => enabledTypes.has(type.id));
    const mimeTypes = enabledFileTypes.flatMap(type => type.mimeTypes);
    const extensions = enabledFileTypes.flatMap(type => type.extensions.map(ext => `.${ext}`));
    return [...new Set([...mimeTypes, ...extensions])].join(',');
  };

  if (!user) return null;

  // Показати завантаження в адмін режимі поки не ініціалізовано
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
          Налаштування типів файлів
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Оберіть типи файлів, які ви хочете дозволити для завантаження в чаті
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
                      до {fileType.maxSize} МБ
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

        {/* Додавання користувацького типу */}
        <div className="border-t pt-4">
          {!showAddForm ? (
            <Button
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Додати користувацький тип файлів
            </Button>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customName">Назва типу</Label>
                  <Input
                    id="customName"
                    value={customType.name}
                    onChange={(e) => setCustomType(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="наприклад: CAD файли"
                  />
                </div>
                <div>
                  <Label htmlFor="customSize">Максимальний розмір (МБ)</Label>
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
                <Label htmlFor="customExtensions">Розширення файлів (через кому)</Label>
                <Input
                  id="customExtensions"
                  value={customType.extensions}
                  onChange={(e) => setCustomType(prev => ({ ...prev, extensions: e.target.value }))}
                  placeholder="dwg, step, iges"
                />
              </div>
              
              <div>
                <Label htmlFor="customDescription">Опис (необов'язково)</Label>
                <Input
                  id="customDescription"
                  value={customType.description}
                  onChange={(e) => setCustomType(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Файли CAD (DWG, STEP, IGES)"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addCustomType} disabled={!customType.name || !customType.extensions}>
                  Додати
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Скасувати
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Інформація про поточні налаштування */}
        {enabledTypes.size > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Поточні налаштування:</h5>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Увімкнено типів файлів: <strong>{enabledTypes.size}</strong></p>
              <p>Максимальний розмір файлу: <strong>{getTotalMaxFileSize()} МБ</strong></p>
              <details className="mt-2">
                <summary className="cursor-pointer hover:text-foreground">
                  Строка accept для input
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

// Глобальні змінні для кешування
let cachedFileTypes: FileTypeConfig[] | null = null;

// Функція для отримання поточної конфігурації
export async function getFileTypeConfig(): Promise<FileTypeConfig[]> {
  // Якщо є кешовані дані, повертаємо їх
  if (cachedFileTypes) {
    return cachedFileTypes;
  }

  try {
    // Спробуємо отримати глобальні налаштування
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
  
  // Fallback до дефолтних налаштувань
  cachedFileTypes = DEFAULT_FILE_TYPES;
  return cachedFileTypes;
}
