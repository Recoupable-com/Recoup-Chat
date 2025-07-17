import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
  const { content } = await req.json();

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    schema: z.object({
      suggestions: z.array(z.string()),
    }),
    prompt: `Generate 4 suggestions for the following prompt: ${content}`,
  });

  return NextResponse.json(object);
};
