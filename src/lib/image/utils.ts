import { aiApi, imageApi } from "@/lib/api";
import type { ImageGenerationConfig } from "@/config/image-generation";
import { toast } from "sonner";

export const generateImageWithConfig = async (
  prompt: string,
  config?: Partial<ImageGenerationConfig>
) => {
  try {
    const response = await aiApi.generateImage(prompt, config);
    return response.data.url;
  } catch (error: any) {
    if (error?.response?.status === 429) {
      toast.error(
        "Too many requests. Please try again later or login for more requests if not already logged in."
      );
    } else if (error?.response?.status === 401) {
      toast.error("Authentication error. Please login to continue.");
    } else if (error?.response?.status === 400) {
      toast.error("Invalid request. Please check your prompt and try again.");
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to generate image. Please try again later.");
    }
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

export async function dynamicBlurDataUrl(url: string) {
  const base64str = await fetch(url).then(async (res) =>
    Buffer.from(await res.arrayBuffer()).toString("base64")
  );

  const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
      <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='1' />
      </filter>

      <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' 
      href='data:image/avif;base64,${base64str}' />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
}
