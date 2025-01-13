import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useCallback, type ChangeEvent } from "react";
import { Icons } from "@/components/icons";
import {
  useDropZone,
  useFileUpload,
  useUploader,
} from "@/hooks/image/file-hooks";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { MediaType } from "./types";

const ACCEPT_TYPES = {
  image: {
    mime: "image/*",
    extensions: ".jpg,.jpeg,.png,.webp,.gif",
  },
  video: {
    mime: "video/*",
    extensions: ".mp4,.webm,.ogg",
  },
} as const;

const MEDIA_ICONS = {
  image: Icons.image,
  video: Icons.video,
} as const;

export function MediaUploader({
  node,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) {
  const mediaType = (node.attrs.type || "image") as MediaType;
  const MediaIcon = MEDIA_ICONS[mediaType];

  const replaceWithMedia = useCallback(
    (mediaUrl: string, dimensions?: { width: number; height: number }) => {
      if (editor) {
        const command =
          mediaType === "image"
            ? editor.chain().setImageBlock({
                src: mediaUrl,
                ...(dimensions && {
                  width: dimensions.width,
                  height: dimensions.height,
                }),
              })
            : editor.chain().setVideo(mediaUrl);

        command.deleteRange({ from: getPos(), to: getPos() }).focus().run();

        toast.success(`${mediaType} uploaded successfully.`);
      }
    },
    [editor, getPos, mediaType]
  );

  const { loading, uploadFile } = useUploader({
    type: mediaType,
    onUpload: replaceWithMedia,
  });

  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
    uploader: uploadFile,
    acceptedTypes: ACCEPT_TYPES[mediaType].mime,
  });

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      e.target.files ? uploadFile(e.target.files[0]) : null,
    [uploadFile]
  );

  if (loading) {
    return (
      <NodeViewWrapper>
        <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">
          <Spinner className="text-neutral-500" size={1.5} />
        </div>
      </NodeViewWrapper>
    );
  }

  console.log(mediaType);
  return (
    <NodeViewWrapper className="border-2 border-dashed border-neutral-200 rounded-lg">
      <div className="p-0 m-0" data-drag-handle>
        <div
          className={cn(
            "flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80",
            draggedInside && "bg-neutral-100"
          )}
          onDrop={onDrop}
          onDragOver={onDragEnter}
          onDragLeave={onDragLeave}
          contentEditable={false}
        >
          <MediaIcon className="w-12 h-12 mb-4 text-black dark:text-white opacity-20" />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
              {draggedInside ? `Drop ${mediaType} here` : "Drag and drop or"}
            </div>
            <div>
              <Button
                disabled={draggedInside}
                onClick={handleUploadClick}
                variant="outline"
                size="sm"
              >
                <Icons.upload />
                Upload {mediaType}
              </Button>
            </div>
          </div>
          <input
            className="w-0 h-0 overflow-hidden opacity-0"
            ref={ref}
            type="file"
            accept={ACCEPT_TYPES[mediaType].extensions}
            onChange={onFileChange}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
