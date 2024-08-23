"use client";
import ImageUploadDialog from "@/components/dialogs/image-upload-dialog";
import { useEffect, useState } from "react";

export default function ImageUploadPage() {
  const [image, setImage] = useState<string | File | null>(
    "http://localhost:3000/images/lion.png"
  );
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  }, []);

  return (
    <ImageUploadDialog
      image={image}
      setImage={setImage}
      open={open}
      setOpen={setOpen}
      onSubmit={() => {}}
      onCancel={() => setOpen(false)}
    />
  );
}
