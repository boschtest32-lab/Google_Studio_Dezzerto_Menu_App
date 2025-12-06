import { GoogleGenAI } from "@google/genai";
import { Category } from '../types';

export const getGeminiRecommendation = async (userPreference: string, menu: Category[]) => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not set. Skipping AI recommendation.");
    return "I'm sorry, I can't provide recommendations right now. Please check the menu manually!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a simplified text representation of the menu to save tokens and avoid complexity
    const menuSummary = menu.map(c => {
      let items = "";
      if (c.products) {
        items = c.products.map(p => p.name).join(", ");
      } else if (c.subCategories) {
        items = c.subCategories.map(sc => sc.products.map(p => p.name).join(", ")).join(", ");
      }
      return `${c.name}: [${items}]`;
    }).join("\n");

    const prompt = `
      You are a friendly server at "Dezzerto", a café with the tagline "Sweet Side of Life".
      
      Here is our menu summary:
      ${menuSummary}
      
      The customer says: "${userPreference}"
      
      Please recommend 2-3 specific items from the menu that match their taste. 
      Keep the response short, friendly, and appetizing (under 50 words). 
      Do not invent items not on the menu.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble thinking right now. Maybe try our Signature Thick Shake?";
  }
};