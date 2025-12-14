import { SpotifyDeepResearchResultUIType } from "@/types/spotify";
import GetArtistSocialsResult from "./GetArtistSocialsResult";
import { ArtistSocialsResultType } from "@/types/ArtistSocials";
import Image from "next/image";
import spotifyLogo from "@/public/brand-logos/spotify.png";

export default function SpotifyDeepResearchResult({
  result,
}: {
  result: SpotifyDeepResearchResultUIType;
}) {
  const processedResult = {
    success: result.success,
    socials: result.artistSocials.socials,
    status: result.success ? "success" : "error",
    pagination: {
      page: 1,
      limit: 10,
      total_count: result.artistSocials.socials.length,
      total_pages: 1,
    },
  } as ArtistSocialsResultType;
  return (
    <GetArtistSocialsResult
      title="Spotify Deep Research Complete"
      icon={
        <Image
          src={spotifyLogo.src}
          alt="Spotify Logo"
          width={20}
          height={20}
        />
      }
      errorText="Spotify Deep Research Failed"
      result={processedResult}
    />
  );
}
