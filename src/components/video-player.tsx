import React, { useState, useRef, useEffect } from "react";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";

type VideoPlayerProps = {
  src: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  muted?: boolean;
  poster?: string;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
};

const VideoPlayer = ({
  src,
  width = DEFAULT_IMAGE_GENERATION_CONFIG.width,
  height = DEFAULT_IMAGE_GENERATION_CONFIG.height,
  autoPlay = false,
  muted = false,
  poster,
  onError,
  onPlay,
  onPause,
  className = "",
}: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoading(false);
    const handleError = () => {
      const error = new Error("Failed to load video");
      setError("Failed to load video");
      onError?.(error);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [onError]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ width, height }}
      >
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
          style={{ width, height }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
      <video
        ref={videoRef}
        width={width}
        height={height}
        controls
        preload="metadata"
        autoPlay={autoPlay}
        muted={muted}
        poster={poster}
        className={`rounded-lg ${className} ${
          isLoading ? "invisible" : "visible"
        }`}
        onPlay={onPlay}
        onPause={onPause}
        playsInline
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <track src={src} kind="subtitles" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
