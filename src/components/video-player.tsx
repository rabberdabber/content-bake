import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";
import React from "react";

type VideoPlayerProps = {
  src: string;
  width: number;
  height: number;
};

const VideoPlayer = ({
  src,
  width = DEFAULT_IMAGE_GENERATION_CONFIG.width,
  height = DEFAULT_IMAGE_GENERATION_CONFIG.height,
}: VideoPlayerProps) => {
  return (
    <video width={width} height={height} controls preload="none">
      <source src={src} type="video/mp4" />
      <track src={src} kind="subtitles" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
