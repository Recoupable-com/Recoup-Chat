export type ArweaveUploadResponse = {
  id: string;
  uri: string;
};

export const uploadFile = async (
  file: File,
): Promise<ArweaveUploadResponse> => {
  try {
    const data = new FormData();
    data.set("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error || "Upload failed");
    }

    return {
      id: json.id,
      uri: json.url,
    };
  } catch (error) {
    console.error("Arweave upload failed:", error);
    throw error;
  }
};
