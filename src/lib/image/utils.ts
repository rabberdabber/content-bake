import {
  DEFAULT_IMAGE_GENERATION_CONFIG,
  ImageGenerationConfig,
} from "@/config/image-generation";

const BASE_URL = "http://127.0.0.1:8000";

export interface ImageGenerationResponse {
  id: string;
  url: string;
  prompt: string;
  model: ImageGenerationConfig["model"];
}

export const uploadImage = async (image: File | Blob) => {
  const imageId = crypto.randomUUID();
  const imageBlob = await image.arrayBuffer();

  const formData = new FormData();
  formData.append("file", new Blob([imageBlob]), "uploaded-image.jpg");

  const uploadResponse = await fetch(
    `${BASE_URL}/api/v1/images/upload/${imageId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  // Create the final image URL using the image ID
  const imageUrl = `${BASE_URL}/uploads/${imageId}.jpg`;
  return imageUrl;
};

export const generateImageWithConfig = async (
  prompt: string,
  config?: Partial<ImageGenerationConfig>
) => {
  const finalConfig = { ...DEFAULT_IMAGE_GENERATION_CONFIG, ...config };

  const response = await fetch(`${BASE_URL}/api/v1/ai/generate-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      model: finalConfig.model,
      prompt,
      width: finalConfig.width,
      height: finalConfig.height,
      prompt_upsampling: finalConfig.promptUpsampling,
      seed: 0,
      safety_tolerance: finalConfig.safetyTolerance,
      output_format: finalConfig.outputFormat,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate image");
  }

  const imageGenerationResponse =
    (await response.json()) as ImageGenerationResponse;

  return imageGenerationResponse.url;
};
