import { SpotifyArtistTopTracksResultType } from "@/types/spotify";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import SpotifyTrackCard from "./SpotifyTrackCard";

const SpotifyArtistTopTracksResult = ({ result }: { result: SpotifyArtistTopTracksResultType }) => {
  if (result.status !== "success") {
    return <div>Failed to get Spotify artist top tracks</div>;
  }

  const tracks = result.tracks;

  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image 
            src="/brand-logos/spotify.png" 
            alt="Spotify" 
            width={24} 
            height={24} 
            className="rounded-full"
          />
          <h3 className="font-semibold text-lg">Top Tracks</h3>
        </div>
        <Badge className="bg-[#1DB954] hover:bg-[#1DB954]/90 rounded-xl">Spotify</Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tracks.map((track) => (
          <SpotifyTrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

export default SpotifyArtistTopTracksResult;