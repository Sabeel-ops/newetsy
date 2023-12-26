import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCoLQnJWSk6zPOsdZ0Hq0jNC6deWR7x8BE"; // Replace with your API key
const genAI = new GoogleGenerativeAI(API_KEY);

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

async function generateText() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "Generate an SEO optimized Etsy title for this product that will rank well on Etsy";

  const imageInput = document.getElementById("imageInput");

  // Check if at least one file is selected
  if (imageInput.files.length === 0) {
    const outputDiv = document.getElementById("output");
    outputDiv.textContent = "Please select an image.";
    return;
  }

  const imageParts = await Promise.all(
    [...imageInput.files].map(fileToGenerativePart)
  );

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();

    const outputDiv = document.getElementById("output");
    outputDiv.textContent = text;
  } catch (error) {
    console.error("Error generating text:", error);
  }
}

// Event listener for the button click
document.getElementById("generateButton").addEventListener("click", generateText);
