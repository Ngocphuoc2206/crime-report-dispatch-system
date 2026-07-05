"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type EvidenceBinaryFile = {
  id: string;
  file: File;
};

type EvidenceFilesContextValue = {
  files: EvidenceBinaryFile[];
  addFiles: (files: EvidenceBinaryFile[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
};

const EvidenceFilesContext = createContext<EvidenceFilesContextValue | null>(
  null,
);

export function EvidenceFilesProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [files, setFiles] = useState<EvidenceBinaryFile[]>([]);

  const addFiles = useCallback((newFiles: EvidenceBinaryFile[]) => {
    const newIds = new Set(newFiles.map(({ id }) => id));
    setFiles((current) => [
      ...current.filter(({ id }) => !newIds.has(id)),
      ...newFiles,
    ]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const value = useMemo(
    () => ({ files, addFiles, removeFile, clearFiles }),
    [files, addFiles, removeFile, clearFiles],
  );

  return (
    <EvidenceFilesContext.Provider value={value}>
      {children}
    </EvidenceFilesContext.Provider>
  );
}

export function useEvidenceFiles() {
  const context = useContext(EvidenceFilesContext);

  if (!context) {
    throw new Error("useEvidenceFiles must be used inside EvidenceFilesProvider");
  }

  return context;
}
