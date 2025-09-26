import { NextRequest, NextResponse } from "next/server";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { generateChatTitle } from "@/lib/chat/generateChatTitle";
import { CreateChatRequest } from "@/types/Chat";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body: CreateChatRequest = await request.json();

    const { accountId, artistId, chatId, firstMessage } = body;

    if (!accountId || !firstMessage || !artistId || !chatId) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          success: false,
        },
        {
          status: 400,
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
        }
      );
    }

    return NextResponse.json(
      {
        room: new_room,
        success: true,
      },
      {
        status: 200,
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
      }
    );
  }
}
