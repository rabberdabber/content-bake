import { NodeViewWrapper, Editor } from "@tiptap/react";
import { useCallback, type ChangeEvent } from "react";
import { Icons } from "@/components/icons";
import { useDropZone, useFileUpload, useUploader } from "./hooks";
import { cn } from "@/lib/utils";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface ImageUploaderProps {
  node: any;
  deleteNode: () => void;
  editor?: Editor;
}

export function ImageUploader({
  node,
  deleteNode,
  editor,
}: ImageUploaderProps) {
  const replaceWithImage = (imageUrl: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .command(({ tr, dispatch }) => {
          if (dispatch) {
            toast.success("Image uploaded successfully");
            tr.replaceWith(
              tr.selection.from,
              tr.selection.from + 1,
              editor.schema.nodes.image.create({
                src: imageUrl,
                alt: "Uploaded image",
                width: DEFAULT_IMAGE_GENERATION_CONFIG.width,
                height: DEFAULT_IMAGE_GENERATION_CONFIG.height,
              })
            );
          }
          return true;
        })
        .run();
      deleteNode?.();
    }
  };

  const { loading, uploadFile } = useUploader({ onUpload: replaceWithImage });
  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
    uploader: uploadFile,
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
          <Icons.imageIcon className="w-12 h-12 mb-4 text-black dark:text-white opacity-20" />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
              {draggedInside ? "Drop image here" : "Drag and drop or"}
            </div>
            <div>
              <Button
                disabled={draggedInside}
                onClick={handleUploadClick}
                variant="outline"
                size="sm"
              >
                <Icons.upload />
                Upload an image
              </Button>
            </div>
          </div>
          <input
            className="w-0 h-0 overflow-hidden opacity-0"
            ref={ref}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif"
            onChange={onFileChange}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
