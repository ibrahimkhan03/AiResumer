import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { positionHighlight, skillsHighlight, customPrompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const finalPrompt = customPrompt
      ? customPrompt
      : `
      Generate a professional AI resume summary under 400 characters.
      Position Highlight: ${positionHighlight}
      Skills Highlight: ${skillsHighlight}
    `;

    const result = await model.generateContent(finalPrompt);
    const text = result.response.text();

  // Always return the full response as a single summary
  const summary = text.trim();
  return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
