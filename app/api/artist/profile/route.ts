import getFormattedArtist from "@/lib/getFormattedArtist";
import supabase from "@/lib/supabase/serverClient";
import updateArtistProfile from "@/lib/supabase/artist/updateArtistProfile";
import updateArtistSocials from "@/lib/supabase/updateArtistSocials";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const image = body.image;
  const name = body.name;
  const artistId = body.artistId;
  const email = body.email;
  const profileUrls = body.profileUrls;
  const label = body.label;
  const instruction = body.instruction;
  const knowledges = body.knowledges;

  try {
    const { account_id: artistAccountId } = await updateArtistProfile(
      artistId,
      email,
      image,
      name,
      instruction,
      label,
      knowledges
    );

    await updateArtistSocials(artistAccountId as string, profileUrls);
    const { data: account } = await supabase
      .from("accounts")
      .select("*, account_info(*), account_socials(*, social:socials(*))")
      .eq("id", artistAccountId)
      .single();

    if (!account) throw new Error("failed");

    return Response.json(
      {
        artist: getFormattedArtist(account),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
