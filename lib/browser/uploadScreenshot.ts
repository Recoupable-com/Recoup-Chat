import { uploadFileByKey } from "@/lib/supabase/storage/uploadFileByKey";
import { createSignedUrlForKey } from "@/lib/supabase/storage/createSignedUrl";

/**
 * Upload a browser screenshot to Supabase storage and return a signed URL
 * @param screenshot - Base64 encoded screenshot
 * @param platformName - Name of the platform (for the filename)
 * @returns Public URL to the uploaded screenshot
 */
export async function uploadScreenshot(
  screenshot: string,
  platformName: string = "browser"
): Promise<string> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(screenshot, "base64");
    const blob = new Blob([buffer], { type: "image/png" });

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `browser-screenshots/${platformName}-${timestamp}.png`;

    // Upload to Supabase storage
    await uploadFileByKey(filename, blob, {
      contentType: "image/png",
      upsert: true,
    });

    // Get a signed URL that expires in 1 hour (3600 seconds)
    const signedUrl = await createSignedUrlForKey(filename, 3600);

    console.log(`[uploadScreenshot] Screenshot uploaded: ${filename}`);
    return signedUrl;
  } catch (error) {
    console.error("[uploadScreenshot] Error uploading screenshot:", error);
    // Return empty string if upload fails - don't block the tool execution
    return "";
  }
}

