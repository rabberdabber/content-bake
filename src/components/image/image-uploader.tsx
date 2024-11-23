"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { Label } from "../ui/label";
import Image from "next/image";

type ImageUploaderProps = {
  image: string | File | null;
  setImage: (image: string | File | null) => void;
};

export default function ImageUploader({ image, setImage }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    console.log(fileList);
    if (fileList) {
      console.log("image set to file");
      console.log(fileList[0]);
      setImage(fileList[0]);
    }
  };

  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (urlInput) {
      setImage(urlInput);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const generateImage = async (prompt: string) => {
    try {
      // Generate a UUID for the image
      const imageId = crypto.randomUUID();

      // First, generate the image
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/generate-image?model=flux-pro-1.1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            prompt,
            width: 512,
            height: 512,
            prompt_upsampling: false,
            seed: 0,
            safety_tolerance: 2,
            output_format: "jpeg",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      // Get the image blob
      const imageBlob = await response.blob();

      // Create FormData and append the image blob
      const formData = new FormData();
      formData.append("file", imageBlob, "generated-image.jpg");

      // Upload the generated image
      const uploadResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/upload/${imageId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Create the final image URL using the image ID
      const imageUrl = `http://127.0.0.1:8000/uploads/${imageId}.jpg`;
      setImage(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  };

  const handleChatSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsGenerating(true);

    try {
      // Generate image from the prompt
      const imageUrl = await generateImage(userInput);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  console.log(image);
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Icons.upload className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
                {files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <Icons.XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or Enter Image URL
                  </span>
                </div>
              </div>
              <form onSubmit={handleUrlSubmit} className="flex space-x-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="http://localhost:3000/images/lion.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Icons.link className="h-4 w-4" />
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or Chat with AI
                  </span>
                </div>
              </div>
              <div className="grid gap-4 py-4">
                {chatMessages.length > 0 && (
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${
                          msg.role === "ai" ? "text-blue-600" : "text-green-600"
                        }`}
                      >
                        <strong>{msg.role === "ai" ? "AI: " : "You: "}</strong>
                        {msg.content}
                      </div>
                    ))}
                  </ScrollArea>
                )}
                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                  <Textarea
                    placeholder="Describe the image you want to generate..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-grow"
                    disabled={isGenerating}
                  />
                  <Button type="submit" size="icon" disabled={isGenerating}>
                    {isGenerating ? (
                      <Icons.refresh className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Uploaded and Linked Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {image && (
              <Image
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Linked image`}
                width={500}
                height={500}
                className="object-cover rounded-md"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
