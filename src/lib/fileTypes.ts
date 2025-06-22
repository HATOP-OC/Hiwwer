// Global file type configuration management
import { FileTypeConfig } from './api';

// Default file types
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

// Cache for file type configurations
let cachedFileTypes: FileTypeConfig[] | null = null;
let cacheExpiration: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// API endpoint for file types
const API_BASE = '/v1';

// Fetch file type configuration from server
export async function fetchFileTypeConfig(): Promise<FileTypeConfig[]> {
  try {
    const response = await fetch(`${API_BASE}/file-types`);
    if (!response.ok) {
      throw new Error('Failed to fetch file types');
    }
    
    const data = await response.json();
    
    // Логіка обробки відповіді:
    // - null або undefined: використовувати дефолтні налаштування
    // - [] (порожній масив): заборонити всі файли
    // - [...] (масив з елементами): використовувати конкретні типи
    if (data.allowedFileTypes === null || data.allowedFileTypes === undefined) {
      cachedFileTypes = DEFAULT_FILE_TYPES;
    } else {
      cachedFileTypes = data.allowedFileTypes; // може бути порожнім масивом
    }
    
    cacheExpiration = Date.now() + CACHE_DURATION;
    return cachedFileTypes;
  } catch (error) {
    console.error('Error fetching file types:', error);
    // Return default types if API fails
    return DEFAULT_FILE_TYPES;
  }
}

// Get file type configuration (with caching)
export async function getFileTypeConfig(): Promise<FileTypeConfig[]> {
  // Check if cache is valid
  if (cachedFileTypes && Date.now() < cacheExpiration) {
    return cachedFileTypes;
  }
  
  // Fetch fresh data
  return await fetchFileTypeConfig();
}

// Synchronous version (uses cache or defaults)
export function getFileTypeConfigSync(): FileTypeConfig[] {
  // If cache is valid, return it
  if (cachedFileTypes && Date.now() < cacheExpiration) {
    return cachedFileTypes;
  }
  
  // If no cache, try to fetch in background
  fetchFileTypeConfig().catch(console.error);
  
  // Return cached data if available (even if expired) or defaults
  return cachedFileTypes || DEFAULT_FILE_TYPES;
}

// Get accept string for file input
export function getAcceptString(): string {
  const enabledFileTypes = getFileTypeConfigSync();
  
  // If no file types are enabled, return empty string to block all uploads
  if (enabledFileTypes.length === 0) {
    return '';
  }
  
  const mimeTypes = enabledFileTypes.flatMap(type => type.mimeTypes);
  const extensions = enabledFileTypes.flatMap(type => type.extensions.map(ext => `.${ext}`));
  return [...new Set([...mimeTypes, ...extensions])].join(',');
}

// Get maximum file size
export function getMaxFileSize(): number {
  const enabledFileTypes = getFileTypeConfigSync();
  
  // If no file types are enabled, return 0 to block all uploads
  if (enabledFileTypes.length === 0) {
    return 0;
  }
  
  return Math.max(...enabledFileTypes.map(type => type.maxSize), 10);
}

// Check if file type is allowed
export function isFileTypeAllowed(fileName: string): boolean {
  const enabledFileTypes = getFileTypeConfigSync();
  
  // If no file types are enabled, block all uploads
  if (enabledFileTypes.length === 0) {
    return false;
  }
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return false;
  
  return enabledFileTypes.some(type => 
    type.extensions.includes(extension)
  );
}

// Check if file size is allowed
export function isFileSizeAllowed(fileSize: number): boolean {
  const maxSize = getMaxFileSize();
  
  // If max size is 0, block all uploads
  if (maxSize === 0) {
    return false;
  }
  
  return fileSize <= maxSize * 1024 * 1024; // Convert MB to bytes
}

// Validate file
export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!isFileTypeAllowed(file.name)) {
    return {
      isValid: false,
      error: 'Цей тип файлу не дозволений для завантаження'
    };
  }
  
  if (!isFileSizeAllowed(file.size)) {
    const maxSize = getMaxFileSize();
    return {
      isValid: false,
      error: `Файл занадто великий. Максимальний розмір: ${maxSize} МБ`
    };
  }
  
  return { isValid: true };
}

// Clear cache (useful for admin panel)
export function clearFileTypeCache(): void {
  cachedFileTypes = null;
  cacheExpiration = 0;
}
