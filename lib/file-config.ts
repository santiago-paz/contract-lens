export type FileType = 'pdf' | 'docx' | 'unknown';

export interface FileConfig {
  extension: string;
  type: FileType;
  label: string;
}

export const ALLOWED_FILE_TYPES: Record<string, FileConfig> = {
  'application/pdf': { 
    extension: '.pdf', 
    type: 'pdf',
    label: 'PDF Document'
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
    extension: '.docx', 
    type: 'docx',
    label: 'Word Document'
  },
  'application/msword': { 
    extension: '.doc', 
    type: 'docx',
    label: 'Word Document (Legacy)'
  },
};

export const ACCEPTED_EXTENSIONS = Object.values(ALLOWED_FILE_TYPES)
  .map(config => config.extension)
  .join(',');

export const getFileType = (file: File): FileType => {
  if (file.type in ALLOWED_FILE_TYPES) {
    return ALLOWED_FILE_TYPES[file.type].type;
  }
  
  // Fallback check by extension if mime type is missing/generic
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.pdf')) return 'pdf';
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return 'docx';
  
  return 'unknown';
};
