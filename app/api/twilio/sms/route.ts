import { NextRequest, NextResponse } from "next/server";
import { parseSmsWebhook } from "@/lib/twilio/parseSmsWebhook";
import { handleIncomingSms } from "@/lib/twilio/handleIncomingSms";
import { createSmsResponse } from "@/lib/twilio/createSmsResponse";

/**
 * POST /api/twilio/sms
 * Webhook endpoint to receive and reply to incoming SMS messages from Twilio
 * Reference: https://www.twilio.com/docs/messaging/quickstart#receive-and-reply-to-an-inbound-sms-message
 */
export async function POST(request: NextRequest) {
  try {
    // Parse incoming SMS webhook data
    const formData = await request.formData();

    // Parse SMS data
    const smsData = parseSmsWebhook(formData);

    // Process SMS and generate response
    const responseMessage = handleIncomingSms(smsData);

    // Create TwiML response
    const twimlResponse = createSmsResponse(responseMessage);

    // Return TwiML response
    return new NextResponse(twimlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error processing SMS webhook:", error);

    // Return error response
    const errorResponse = createSmsResponse(
      "Sorry, there was an error processing your message."
    );

    return new NextResponse(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}

// Make this route dynamic to handle real-time webhooks
export const dynamic = "force-dynamic";
