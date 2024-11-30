const BASE_URL = "http://127.0.0.1:8000";

export const uploadImage = async (image: File | Blob) => {
  const imageId = crypto.randomUUID();
  const imageBlob = await image.arrayBuffer();

  const formData = new FormData();
  formData.append("file", new Blob([imageBlob]), "uploaded-image.jpg");

  const uploadResponse = await fetch(`${BASE_URL}/api/v1/upload/${imageId}`, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  // Create the final image URL using the image ID
  const imageUrl = `${BASE_URL}/uploads/${imageId}.jpg`;
  return imageUrl;
};

export const generateAndUploadImage = async (prompt: string) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/generate-image?model=flux-pro-1.1`,
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

  const imageUrl = await uploadImage(imageBlob);
  return imageUrl;
};
