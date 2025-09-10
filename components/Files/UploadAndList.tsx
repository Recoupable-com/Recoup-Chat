"use client";

import useFilesManager from "@/hooks/useFilesManager";

export default function UploadAndList() {
  const { files, isLoading, file, setFile, status, handleUpload } = useFilesManager();

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          onClick={handleUpload}
          disabled={!file}
          className="inline-flex items-center rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          Upload
        </button>
        {status && <div className="text-sm text-gray-600">{status}</div>}
      </div>

      <div>
        <h2 className="font-medium">Files</h2>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <ul className="list-disc pl-5">
            {files.map((f) => (
              <li key={f.id} className="text-sm">
                {f.file_name} <span className="text-gray-500">({f.mime_type || "unknown"})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
