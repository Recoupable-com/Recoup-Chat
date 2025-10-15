import { uploadFileByKey } from "@/lib/supabase/storage/uploadFileByKey";
import { createSignedUrlForKey } from "@/lib/supabase/storage/createSignedUrl";

export async function uploadScreenshot(
  screenshot: string,
  platformName: string = "browser"
): Promise<string> {
  try {
    const buffer = Buffer.from(screenshot, "base64");
    const blob = new Blob([buffer], { type: "image/png" });

    const timestamp = Date.now();
    const filename = `browser-screenshots/${platformName}-${timestamp}.png`;

    await uploadFileByKey(filename, blob, {
      contentType: "image/png",
      upsert: true,
    });

    const signedUrl = await createSignedUrlForKey(filename, 3600);

    return signedUrl;
  } catch {
    return "";
  }
}

