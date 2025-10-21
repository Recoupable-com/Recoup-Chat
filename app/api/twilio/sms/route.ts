import { NextRequest, NextResponse } from "next/server";
import { parseSmsWebhook } from "@/lib/twilio/parseSmsWebhook";
import { handleIncomingSms } from "@/lib/twilio/handleIncomingSms";
import { sendSmsMessage } from "@/lib/twilio/sendSmsMessage";

/**
 * POST /api/twilio/sms
 * Webhook endpoint to receive SMS messages from Twilio
 *
 * Strategy: Respond immediately (within 15s timeout), then process AI asynchronously
 */
export async function POST(request: NextRequest) {
  try {
    // Parse incoming SMS webhook data
    const formData = await request.formData();
    const smsData = parseSmsWebhook(formData);

    console.log(
      `[${new Date().toISOString()}] SMS received from ${smsData.from}: ${smsData.body}`
    );

    // Process AI generation and send response asynchronously (don't await)
    processAndReply(smsData).catch((error) => {
      console.error("Error in async SMS processing:", error);
    });

    // Respond immediately to Twilio (within 15s timeout)
    // Empty 200 response acknowledges receipt
    return new NextResponse(null, {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing SMS webhook:", error);

    // Still respond with 200 to Twilio to avoid retries
    return new NextResponse(null, {
      status: 200,
    });
  }
}

/**
 * Process AI generation and send reply via Twilio API
 * This runs asynchronously after webhook response
 */
async function processAndReply(smsData: {
  from: string;
  body: string;
  to: string;
  messageSid: string;
  accountSid: string;
  mediaCount: number;
}) {
  try {
    console.log(`[${new Date().toISOString()}] Starting AI generation...`);

    // Generate AI response (can take 10-30+ seconds)
    const responseMessage = await handleIncomingSms(smsData);

    console.log(
      `[${new Date().toISOString()}] AI generation complete: ${responseMessage}`
    );

    // Send response via Twilio REST API
    const messageSid = await sendSmsMessage(smsData.from, responseMessage);

    if (messageSid) {
      console.log(
        `[${new Date().toISOString()}] Reply sent successfully: ${messageSid}`
      );
    } else {
      console.error("Failed to send SMS reply");
    }
  } catch (error) {
    console.error("Error in processAndReply:", error);

    // Send fallback message on error
    await sendSmsMessage(
      smsData.from,
      "Thanks for your message to Recoup! We'll get back to you soon."
    );
  }
}

// Make this route dynamic to handle real-time webhooks
export const dynamic = "force-dynamic";
