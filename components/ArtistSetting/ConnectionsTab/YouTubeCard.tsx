"use client";

import StandaloneYoutubeComponent from "../StandaloneYoutubeComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";

interface YouTubeCardProps {
  artistId: string;
}

const YouTubeCard = ({ artistId }: YouTubeCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          <CardTitle className="text-base">YouTube</CardTitle>
        </div>
        <CardDescription>
          Connect your YouTube channel to enable AI access to your channel data and analytics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StandaloneYoutubeComponent artistAccountId={artistId} />
      </CardContent>
    </Card>
  );
};

export default YouTubeCard;
