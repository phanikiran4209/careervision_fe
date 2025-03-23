import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "Missing resume text or job description" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server configuration error: Missing GOOGLE_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Act as an experienced HR Manager with 20 years of experience in tech hiring. 
      Compare the resume provided below with the job description given below. 
      Evaluate the resume for ATS compatibility, focusing on:
      - Matching skills, keywords, and qualifications with the job description.
      - Formatting issues that might affect ATS parsing (e.g., complex layouts, missing standard headings).
      - Relevance of experience and education.
      
      Provide the following in a JSON string with this structure:
      {"ATS Score":"%","Missing Keywords":"...","Formatting Suggestions":"...","Content Suggestions":"..."}
      
      Here is the Resume text: ${resumeText}
      Here is the Job Description: ${jobDescription}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Ensure the response is valid JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText.replace(/'/g, '"'));
    } catch {
      console.error("Invalid JSON from Gemini API:", responseText);
      return NextResponse.json({ error: "Invalid response from analysis service" }, { status: 500 });
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST to analyze a resume." }, { status: 405 });
}