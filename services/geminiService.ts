import { GoogleGenAI, Modality } from "@google/genai";

// This service uses the Gemini API to perform image analysis and generation.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const imageModel = 'gemini-2.5-flash-image';

/**
 * Generates a detailed text description from a set of images using Gemini.
 * @param images - An array of base64 encoded image strings.
 * @returns A promise that resolves to a detailed description string.
 */
export const generatePersonDescription = async (
  images: string[]
): Promise<string> => {
  console.log("Requesting AI analysis of", images.length, "images...");
  
  const imageParts = images.map(img => ({
    inlineData: {
      data: img,
      mimeType: 'image/jpeg', // Assuming jpeg, png would also work
    },
  }));

  const textPart = {
    text: "Analyze the person in these images and generate a single, detailed, and flattering description of their physical appearance. Focus on facial features, hair, and overall impression. This description will be used to create a digital avatar.",
  };

  const response = await ai.models.generateContent({
    model: imageModel,
    contents: { parts: [...imageParts, textPart] },
  });
  
  console.log("Description generated.");
  return response.text;
};

/**
 * Generates 4 AI twin images based on a text description.
 * @param description - The detailed text description of the person.
 * @returns A promise that resolves to an array of 4 image data URLs.
 */
export const generateTwinImages = async (
  description: string
): Promise<string[]> => {
  console.log("Requesting AI image generation with description...");

  const generateImage = async (prompt: string) => {
    const response = await ai.models.generateContent({
      model: imageModel,
      contents: { parts: [{ text: prompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Image data not found in response");
  };

  const prompts = [
    `Create a realistic, high-quality studio portrait of a person with the following description: ${description}. The person should be looking directly at the camera with a gentle smile.`,
    `Create a photorealistic image of a person described as: ${description}. They should be outdoors, with soft, natural lighting, looking slightly away from the camera.`,
    `Generate a high-fashion, black and white photograph of a person with this description: ${description}. The mood should be sophisticated and timeless.`,
    `Create a candid, lifestyle photo of a person described as: ${description}. They should be laughing or smiling genuinely in a bright, inviting setting like a cafe.`,
  ];

  const imagePromises = prompts.map(prompt => generateImage(prompt));
  const images = await Promise.all(imagePromises);
  
  console.log("4 AI twin images generated.");
  return images;
};


/**
 * Recreates a reference image with the AI twin.
 * @param description - The AI twin's description.
 * @param referenceImage - The base64 reference image.
 * @returns A promise that resolves to a single image data URL.
 */
export const recreateWithTwin = async (
  description: string,
  referenceImage: string,
): Promise<string> => {
  console.log("Requesting AI image recreation with reference image...");
  
  const imagePart = {
    inlineData: {
      data: referenceImage,
      mimeType: 'image/jpeg',
    },
  };
  
  const textPart = {
    text: `The user has provided an image and a description of their 'AI Twin'. Your task is to edit the provided image. Replace the person in the image with the AI Twin, who is described as follows: '${description}'. Keep the background, pose, and style of the original image as closely as possible.`,
  };

  const response = await ai.models.generateContent({
    model: imageModel,
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      console.log("Recreation complete.");
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Recreated image data not found in response");
};