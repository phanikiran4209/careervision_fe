import { NextRequest, NextResponse } from "next";
import { MongoClient } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const uri = process.env.MONGODB_URI || "";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { jobRole, jobDescription, yearsExperience, responses } = await req.json();
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("interviewDB");
    const collection = database.collection("interviews");
    const historicalData = await collection.find({ job_role: jobRole }).limit(5).toArray();

    const prompt = `
      You are an AI expert analyzing interview responses. Below are the candidate's responses for the role of ${jobRole} with a tech stack of ${jobDescription} and ${yearsExperience} years of experience. Also, consider the following historical data from similar interviews: ${JSON.stringify(
        historicalData
      )}. Provide detailed feedback for each response, focusing on relevance, depth, and clarity, and predict a score (0-10) based on the responses and historical data.

      Responses:
      ${responses.map((r: string, i: number) => `Response ${i + 1}: ${r || "No response provided."}`).join("\n")}

      Format the output as:
      - Feedback for each response: "Response X: [Your feedback here]"
      - Predicted score: A number out of 10
    `;

    const resultContent = await model.generateContent(prompt);
    const responseText = await resultContent.response.text();
    console.log("Raw prediction response:", responseText);
    const feedbackLines = responseText.split("\n").filter((line) => line.trim().startsWith("Response"));
    const scoreLine = responseText.split("\n").find((line) => line.toLowerCase().includes("predicted score"));
    const totalScore = scoreLine ? parseInt(scoreLine.match(/\d+/)?.[0] || "5") : 5;

    return NextResponse.json({ feedback: feedbackLines, score: totalScore });
  } catch (error) {
    console.error("Error predicting feedback:", error);
    return NextResponse.json({ error: "Failed to predict feedback" }, { status: 500 });
  } finally {
    await client.close();
  }
}