import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/image/image-uploader";

type ImageUploadDialogProps = {
  image: string | File | null;
  setImage: (image: string | File | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (image: string | File | null) => void;
  onCancel: () => void;
};

const ImageUploadDialog = ({
  image,
  setImage,
  open,
  setOpen,
  onSubmit,
  onCancel,
}: ImageUploadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md lg:max-w-screen-lg overflow-y-scroll max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload Image using either the URL or by uploading a file or chat
            with AI about Photos.
          </DialogDescription>
        </DialogHeader>
        <ImageUploader image={image} setImage={setImage} />
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Close
          </Button>
          <Button type="button" onClick={onCancel}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
