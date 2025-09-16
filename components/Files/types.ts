export interface FileRow {
  id: string;
  file_name: string;
  storage_key: string;
  mime_type?: string | null;
  is_directory?: boolean;
}


