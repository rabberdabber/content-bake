"use client";

import Image from "next/image";
import { Icons } from "@/components/icons";
import {
  useFileUpload,
  useDropZone,
  useUploader,
} from "@/hooks/image/file-hooks";
import { cn } from "@/lib/utils";
import { ChangeEvent, DragEvent } from "react";

interface FeatureImageUploadProps {
  featuredImage: string;
  setFeaturedImage: (val: string) => void;
}

export default function FeatureImageUpload({
  featuredImage,
  setFeaturedImage,
}: FeatureImageUploadProps) {
  const { loading, uploadFile } = useUploader({
    type: "image",
    onUpload: (url) => {
      setFeaturedImage(url);
    },
  });

  const { ref: fileInputRef, handleUploadClick } = useFileUpload();

  // Handle drag and drop
  const { draggedInside, onDragEnter, onDragLeave, onDrop } = useDropZone({
    uploader: uploadFile,
  });

  // On file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // Prevent default drag over
  const onDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-none border-t-0 p-4 transition-colors",
        draggedInside ? "border-primary" : "border-border/40",
        "hover:border-primary cursor-pointer"
      )}
      onClick={handleUploadClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {featuredImage ? (
        <div className="relative mx-auto w-full aspect-[4/1] rounded-lg overflow-hidden">
          <Image
            src={featuredImage}
            alt="Feature image"
            fill
            className="object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFeaturedImage("");
            }}
            className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
          >
            <Icons.x className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
          <Icons.image className="h-6 w-6 mb-2" />
          <p className="text-sm">
            {loading
              ? "Uploading..."
              : "Click or drag and drop to add a feature image"}
          </p>
        </div>
      )}
    </div>
  );
}
