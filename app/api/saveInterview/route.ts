import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

export async function POST(request: Request) {
  const { jobRole, jobDescription, yearsExperience, questions, responses, feedback, score } = await request.json();
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("interviewDB");
    const collection = database.collection("interviews");

    const result = await collection.insertOne({
      job_role: jobRole,
      job_description: jobDescription,
      years_experience: parseInt(yearsExperience),
      questions: questions,
      responses: responses,
      feedback: feedback || [],
      score: score || null,
      created_at: new Date(),
    });

    return NextResponse.json({ message: "Interview saved", interviewId: result.insertedId });
  } catch (error) {
    console.error("Error saving interview:", error); // Log the exact error
    return NextResponse.json({ error: "Failed to save interview" }, { status: 500 });
  } finally {
    await client.close();
  }
}