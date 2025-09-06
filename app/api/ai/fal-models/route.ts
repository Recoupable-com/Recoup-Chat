import { NextResponse } from "next/server";

/**
 * GET /api/ai/fal-models
 * 
 * Fetches available models from Fal AI
 */
export async function GET() {
  try {
    console.log("🎨 FAL MODELS: Fetching available models from Fal");

    // For now, manually define the popular Fal models
    // TODO: Replace with dynamic fetching when Fal SDK supports it
    const falModels = [
      {
        id: "fal-ai/nano-banana/edit",
        name: "Nano Banana",
        description: "Google's state-of-the-art image generation and editing model",
        pricing: {
          input: "0.0001", // Estimated pricing - adjust based on actual Fal pricing
          output: "0.001"
        },
        category: "image-editing",
        provider: "fal"
      },
      {
        id: "fal-ai/flux/dev",
        name: "FLUX.1 Dev", 
        description: "FLUX.1 [dev] model for high-quality image generation",
        pricing: {
          input: "0.0001",
          output: "0.001"
        },
        category: "image-generation",
        provider: "fal"
      },
      {
        id: "fal-ai/flux-pro/kontext",
        name: "FLUX Pro Kontext",
        description: "FLUX.1 Kontext [pro] handles both text and reference images as inputs",
        pricing: {
          input: "0.0002",
          output: "0.002"
        },
        category: "image-editing",
        provider: "fal"
      },
      {
        id: "fal-ai/ideogram/character",
        name: "Ideogram Character",
        description: "Generate consistent character appearances across multiple images",
        pricing: {
          input: "0.0001",
          output: "0.001"
        },
        category: "image-generation", 
        provider: "fal"
      }
    ];

    console.log("🎨 FAL MODELS: Successfully fetched", falModels.length, "models");

    return NextResponse.json({ 
      models: falModels,
      success: true 
    });

  } catch (error) {
    console.error("🎨 FAL MODELS ERROR:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch Fal models",
        models: []
      },
      { status: 500 }
    );
  }
}

// Disable caching to always serve the latest model list
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
