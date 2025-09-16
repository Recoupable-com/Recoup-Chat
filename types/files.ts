export interface FileAccessResult {
  file_id: string;
  artist_account_id: string;
  scope: string;
  created_at: string;
  files: {
    id: string;
    file_name: string;
    storage_key: string;
    mime_type: string | null;
    is_directory: boolean | null;
    created_at: string;
  };
}

export interface CombinedFileRow {
  id: string;
  file_name: string;
  storage_key: string;
  mime_type: string | null;
  is_directory?: boolean | null;
  created_at: string;
  is_shared?: boolean;
  access_granted_at?: string;
  scope?: string;
}
