# File Edit & Save Implementation Plan

## Current Architecture Understanding

### Storage System
- **Storage**: Supabase Storage Bucket (via `SUPABASE_STORAGE_BUCKET` constant)
- **Database**: PostgreSQL (files table) - stores metadata
- **Flow**: 
  1. Upload file → Supabase Storage
  2. Record metadata → `files` table

### Existing Components
1. **`/api/storage/upload-by-key`** - Uploads file to Supabase storage
2. **`/api/files/record`** - Records file metadata in DB
3. **`/api/files/get-signed-url`** - Gets signed URL for reading
4. **`useFileContent` hook** - Fetches file content with TanStack Query

---

## Implementation Strategy

### Phase 1: Create Update API Endpoint ✅

**File**: `app/api/files/update/route.ts`

**Purpose**: Update existing file content in Supabase storage

**Requirements**:
- Accept: `storageKey`, `content` (text), `mimeType`
- Validate: File exists, user has permission
- Convert text → Blob
- Upload to Supabase storage with `upsert: true` (overwrites)
- Update `size_bytes` in files table
- Return: Success/error response

**Security**:
- Validate storage key format
- Check user ownership (via owner_account_id)
- Prevent path traversal attacks

---

### Phase 2: Create Update Mutation Hook ✅

**File**: `hooks/useUpdateFile.ts`

**Purpose**: TanStack Query mutation for updating files

**Features**:
- `useMutation` for file updates
- Optimistic updates
- Invalidate `["file-content", storageKey]` query cache
- Error handling with toast notifications
- Loading states

**Interface**:
```typescript
type UpdateFileParams = {
  storageKey: string;
  content: string;
  mimeType: string;
};

const { mutate, isPending } = useUpdateFile();
```

---

### Phase 3: Integrate with FileInfoDialog ✅

**Updates Required**:

1. **`FileInfoDialog.tsx`**:
   - Import `useUpdateFile` hook
   - Replace console.log with mutation call
   - Add loading state during save
   - Show success/error notifications
   - Disable Save button while pending

2. **`FileInfoDialogHeader.tsx`**:
   - Add `isSaving` prop
   - Disable buttons during save
   - Show loading spinner on Save button

---

### Phase 4: Update Size in Database ✅

**Updates Required**:

1. Create helper: `lib/files/updateFileSize.ts`
   - Calculate new size in bytes
   - Update `files` table `size_bytes` column

2. Call from update API after successful upload

---

### Phase 5: Error Handling & Validation ✅

**Validations**:
- Only allow editing text files (check TEXT_EXTENSIONS)
- Max file size limit (e.g., 10MB for text files)
- Prevent editing if user doesn't own file
- Handle concurrent edits (last write wins)

**Error States**:
- Network errors → Show retry option
- Permission errors → Show error message
- Size limit exceeded → Show warning before save

---

### Phase 6: UI Enhancements (Optional) ✅

**Implemented features**:
- [x] Show unsaved changes indicator (*) in title
- [x] Confirm dialog on Cancel if changes exist
- [x] Keyboard shortcuts (Cmd+S / Ctrl+S to save)
- [x] Show character/line/word count in editor footer
- [x] Unsaved changes hint in description with keyboard shortcut

**Not implemented** (future enhancements):
- [ ] Auto-save draft to localStorage
- [ ] Syntax highlighting for code files

---

## Implementation Checklist

### Backend (API)
- [x] Create `/api/files/update/route.ts`
  - [x] Accept storageKey, content, mimeType
  - [x] Validate storage key format
  - [x] Check file exists in DB
  - [x] Verify user permissions
  - [x] Convert text to Blob
  - [x] Upload to Supabase storage (upsert: true)
  - [x] Calculate new file size
  - [x] Update size_bytes in files table
  - [x] Return success response

### Frontend (Hooks & Utils)
- [x] Create `lib/files/updateFileContent.ts`
  - [x] API call function
  - [x] Type definitions
- [x] Create `hooks/useUpdateFile.ts`
  - [x] useMutation setup
  - [x] Cache invalidation
  - [x] Error handling
  - [x] Toast notifications

### UI Integration
- [x] Update `FileInfoDialog.tsx`
  - [x] Import useUpdateFile
  - [x] Integrate mutation in handleSave
  - [x] Add loading states
  - [x] Success/error toasts (via useUpdateFile hook)
  - [x] Extract account IDs from storage key
  - [x] Reset state on dialog close
  - [x] Reset edited content on cancel/success
- [x] Update `FileInfoDialogHeader.tsx`
  - [x] Add isSaving prop
  - [x] Disable buttons during save
  - [x] Show loading spinner on Save button
  - [x] Update description text during save

### Validation & Error Handling
- [x] Only allow editing text files (check TEXT_EXTENSIONS)
- [x] Max file size limit (10MB for text files)
- [x] Prevent editing if file is not text type
- [x] Handle concurrent edits (last write wins - server-side)
- [x] Network errors → Show error toast (via useUpdateFile)
- [x] Permission errors → Show error toast (via API)
- [x] Size limit exceeded → Show warning before save
- [x] Hide Edit button for non-text files

### Testing & Polish
- [ ] Test edit → save → refresh (content persists)
- [ ] Test cancel without save (no changes)
- [ ] Test error scenarios
- [ ] Test with different file types
- [x] Add loading states
- [x] Add user feedback (toasts)

---

## Security Considerations

1. **Authentication**: Verify user is authenticated
2. **Authorization**: Only owner can edit files
3. **Validation**: 
   - Validate storage key format
   - Prevent path traversal
   - Check file size limits
4. **Rate Limiting**: Prevent abuse (future)

---

## Code Structure

```
app/api/files/
  └── update/
      └── route.ts              # New: Update file endpoint

lib/files/
  ├── fetchFileContent.ts       # Existing: Fetch content
  └── updateFileContent.ts      # New: Update content API call

hooks/
  ├── useFileContent.ts         # Existing: Fetch with React Query
  └── useUpdateFile.ts          # New: Update with React Query

components/Files/
  ├── FileInfoDialog.tsx        # Update: Integrate save
  ├── FileInfoDialogHeader.tsx  # Update: Loading states
  ├── FileEditor.tsx            # Existing: Edit UI
  └── FilePreview.tsx           # Existing: Preview UI
```

---

## Next Steps

1. **Start with Backend**: Create `/api/files/update/route.ts`
2. **Add Client Functions**: Create helper in `lib/files/`
3. **Add React Query Hook**: Create `useUpdateFile.ts`
4. **Integrate UI**: Update dialog components
5. **Test & Polish**: Add loading states and error handling

---

## Notes

- Use `upsert: true` to overwrite existing file in Supabase storage
- Update `size_bytes` in DB after successful upload
- Invalidate TanStack Query cache to show updated content
- Consider adding version history in future (store old versions)
- Use toast notifications for user feedback (already in codebase)

