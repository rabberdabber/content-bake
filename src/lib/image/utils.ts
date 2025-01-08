import { aiApi, imageApi } from "@/lib/api";
import type { ImageGenerationConfig } from "@/config/image-generation";

export const generateImageWithConfig = async (
  prompt: string,
  config?: Partial<ImageGenerationConfig>
) => {
  try {
    const { url } = await aiApi.generateImage(prompt, config);
    return url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const uploadImage = async (
  imageId: string,
  file: File | Blob,
  isBlob: boolean = false
) => {
  try {
    const { url } = await imageApi.uploadImage(imageId, file, { isBlob });
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const processImage = async (imageUrl: string, imageId: string) => {
  try {
    const blob = await imageApi.urlToBlob(imageUrl);
    return await uploadImage(imageId, blob, true);
  } catch (error) {
    console.error("Error processing generated image:", error);
    throw error;
  }
};
