import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
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

export function ImageUploader({ deleteNode, editor, getPos }: NodeViewProps) {
  const replaceWithImage = useCallback(
    (imageUrl: string, dimensions: { width: number; height: number }) => {
      if (editor) {
        editor
          .chain()
          .setImageBlock({ src: imageUrl })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
        toast.success(`Image uploaded successfully.`);
      }
    },
    [editor, getPos]
  );

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
    <NodeViewWrapper>
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
