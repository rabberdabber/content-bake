import React from "react";

type VideoPlayerProps = {
  src: string;
  width: number;
  height: number;
};

const VideoPlayer = ({ src, width = 500, height = 500 }: VideoPlayerProps) => {
  return (
    <video width={width} height={height} controls preload="none">
      <source src={src} type="video/mp4" />
      <track src={src} kind="subtitles" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
