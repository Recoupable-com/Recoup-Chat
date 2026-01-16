import { NextRequest, NextResponse } from "next/server";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { generateChatTitle } from "@/lib/chat/generateChatTitle";
import { sendNewConversationNotification } from "@/lib/telegram/sendNewConversationNotification";
import { CreateChatRequest } from "@/types/Chat";
import { NEW_API_BASE_URL } from "@/lib/consts";

const SUNSET_DAYS = 90;

function getDeprecationHeaders(): Record<string, string> {
  const sunsetDate = new Date();
  sunsetDate.setDate(sunsetDate.getDate() + SUNSET_DAYS);

  return {
    Deprecation: "true",
    Sunset: sunsetDate.toUTCString(),
    Link: `<${NEW_API_BASE_URL}/api/chats>; rel="deprecation"`,
  };
}

/**
 * @deprecated This endpoint is deprecated. Use recoup-api directly at recoup-api.vercel.app/api/chats
 */
export async function POST(request: NextRequest) {
  const deprecationHeaders = getDeprecationHeaders();

  try {
    const body: CreateChatRequest = await request.json();

    const { accountId, artistId, chatId, firstMessage, email } = body;

    if (!accountId || !firstMessage || !artistId || !chatId) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          success: false,
        },
        {
          status: 400,
          headers: deprecationHeaders,
        }
      );
    }

    // Generate chat title from first message
    const generatedTitle = await generateChatTitle(firstMessage || "");

    // Create room with report
    const { new_room, error } = await createRoomWithReport({
      account_id: accountId,
      topic: generatedTitle,
      artist_id: artistId,
      chat_id: chatId,
    });

    if (error) {
      console.error("Error creating room:", error);
      return NextResponse.json(
        {
          error: "Failed to create chat room",
          success: false,
        },
        {
          status: 500,
          headers: deprecationHeaders,
        }
      );
    }

    // Send telegram notification for new conversation
    try {
      await sendNewConversationNotification({
        accountId,
        email: email || "",
        conversationId: new_room.id,
        topic: generatedTitle,
        firstMessage,
      });
    } catch (notificationError) {
      console.error("Failed to send new conversation notification:", notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json(
      {
        room: new_room,
        success: true,
      },
      {
        status: 200,
        headers: deprecationHeaders,
      }
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      {
        error: "Failed to create chat",
        success: false,
      },
      {
        status: 500,
        headers: deprecationHeaders,
      }
    );
  }
}
