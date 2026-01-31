
import { GoogleGenAI } from "@google/genai";
import { CaseData, Language } from "../types";

export async function generateFollowUpMessage(data: CaseData): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageContext = {
    [Language.AR_EGY]: "Egyptian Arabic dialect (Ammiya)",
    [Language.AR_SAU]: "Saudi Arabic dialect (Najdi/Hejazi)",
    [Language.AR_LEV]: "Levantine Arabic dialect (Lebanese/Syrian)",
    [Language.AR_EMR]: "Emirati Arabic dialect (Gulf/Khaleeji)",
    [Language.AR_MAR]: "Maghrebi Arabic dialect (Moroccan)",
    [Language.EN]: "Standard English",
    [Language.FR]: "Standard French",
    [Language.DE]: "Standard German",
  }[data.language];

  const prompt = `
    Generate a professional follow-up message for a dental patient.
    
    Target Language/Dialect: ${languageContext}

    Context:
    - Patient Name: ${data.patientName}
    - Clinic Name: ${data.clinicName}
    - Dental Case Type: ${data.caseType}
    - Reason for hesitation: ${data.hesitationReason}
    - Urgency: ${data.urgencyLevel}
    ${data.price ? `- Quoted Price: ${data.price}` : ''}

    Rules:
    - Tone: Professional, calm, polite, patient-friendly, and reassuring.
    - Avoid: Marketing language, fear-mongering, exaggeration, or pressure.
    - Style: Friendly and empathetic, not cold or corporate.
    - Structure:
        1. Polite greeting using the patient's name.
        2. Reference to the recent consultation at ${data.clinicName}.
        3. Address the ${data.caseType} and gently mention the ${data.hesitationReason} (if price: be understanding; if fear: be supportive; if confusion: offer more clarity).
        4. Reiterate that the clinic is available for any questions to help them feel comfortable.
        5. Gentle closing.
    - Format: Text suitable for WhatsApp. 
    - CRITICAL: Output ONLY the plain text of the message. Do NOT use markdown code blocks, backticks, or any other formatting. Just the raw text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    let text = response.text || "Sorry, I couldn't generate a message. Please try again.";
    // Clean up any potential markdown if the model ignores the instruction
    text = text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate message. Check your connection.");
  }
}
