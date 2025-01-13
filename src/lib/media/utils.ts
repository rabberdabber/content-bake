import { mediaApi } from "../api";

export const uploadMedia = async (
  type: "image" | "gif" | "video",
  mediaId: string,
  file: File | Blob,
  isBlob: boolean = false
) => {
  try {
    const { url } = await mediaApi.uploadMedia(type, mediaId, file, { isBlob });
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const processMedia = async (
  type: "image" | "gif" | "video",
  mediaUrl: string,
  mediaId: string
) => {
  try {
    const blob = await mediaApi.urlToBlob(mediaUrl);
    return await uploadMedia(type, mediaId, blob, true);
  } catch (error) {
    console.error("Error processing generated image:", error);
    throw error;
  }
};
