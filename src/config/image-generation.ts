export type ImageGenerationModelType =
  | "flux-pro-1.1"
  | "flux-pro"
  | "flux-dev"
  | "flux-pro-1.1-ultra"
  | "flux-pro-1.0-fill"
  | "flux-pro-1.0-canny"
  | "flux-pro-1.0-depth";

export type ImageGenerationOutputFormatType = "jpeg" | "png";

export type ImageGenerationConfig = {
  model: ImageGenerationModelType;
  height: number;
  width: number;
  promptUpsampling: boolean;
  outputFormat: ImageGenerationOutputFormatType;
  safetyTolerance: number;
  raw: boolean;
};

export const DEFAULT_IMAGE_GENERATION_CONFIG = {
  model: "flux-pro-1.1-ultra",
  height: 512,
  width: 700,
  promptUpsampling: false,
  outputFormat: "jpeg",
  safetyTolerance: 2,
  raw: true,
} satisfies ImageGenerationConfig;
