import React from "react";
import { YouTubeEmbed, InstagramEmbed, TikTokEmbed, FacebookEmbed } from "react-social-media-embed";

export default function VideoViewer({ mediaUrl }: { mediaUrl: string }) {
  const youtubeRegex = /youtube\.com|youtu\.be/;
  const instagramRegex = /instagram\.com/;
  const tiktokRegex = /tiktok\.com/;
  const facebookRegex = /facebook\.com/;

  if (youtubeRegex.test(mediaUrl)) {
    return (
      <div className="flex justify-center items-center">
        <YouTubeEmbed url={mediaUrl} width={450} height={300} />
      </div>
    );
  }
  if (instagramRegex.test(mediaUrl)) {
    return (
      <div className="flex justify-center items-center">
        <InstagramEmbed url={mediaUrl} width={450} height={700} />
      </div>
    );
  }
  if (tiktokRegex.test(mediaUrl)) {
    return (
      <div className="flex justify-center items-center">
        <TikTokEmbed url={mediaUrl} width={450} height={700} />
      </div>
    );
  }
  if (facebookRegex.test(mediaUrl)) {
    return (
      <div className="flex justify-center items-center">
        <FacebookEmbed url={mediaUrl} width={450} height={300} />
      </div>
    );
  }

  return <p>Link de mídia social não reconhecido.</p>;
}
