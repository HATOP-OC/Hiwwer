import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchGlobalFileTypes, FileTypeConfig } from '@/lib/api';

interface FileTypeContextValue {
  allowedFileTypes: FileTypeConfig[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const FileTypeContext = createContext<FileTypeContextValue | undefined>(undefined);

interface FileTypeProviderProps {
  children: ReactNode;
}

export function FileTypeProvider({ children }: FileTypeProviderProps) {
  const [allowedFileTypes, setAllowedFileTypes] = useState<FileTypeConfig[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFileTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fileTypes = await fetchGlobalFileTypes();
      setAllowedFileTypes(fileTypes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch file types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileTypes();
  }, []);

  const value: FileTypeContextValue = {
    allowedFileTypes,
    loading,
    error,
    refetch: fetchFileTypes,
  };

  return (
    <FileTypeContext.Provider value={value}>
      {children}
    </FileTypeContext.Provider>
  );
}

export function useFileTypes() {
  const context = useContext(FileTypeContext);
  if (context === undefined) {
    throw new Error('useFileTypes must be used within a FileTypeProvider');
  }
  return context;
}
