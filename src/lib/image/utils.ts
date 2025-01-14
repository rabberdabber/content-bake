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
