import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { GoogleGenerativeAI } from '@google/generative-ai'

const uri = process.env.MONGODB_URI || ''
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Singleton MongoDB client for connection pooling
let client: MongoClient
let clientPromise: Promise<MongoClient> = new MongoClient(uri).connect()

if (!clientPromise) {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { jobRole, jobDescription, yearsExperience, responses } = await req.json()

    // Validate required fields
    if (!jobRole || !jobDescription || !yearsExperience || !responses || !Array.isArray(responses)) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const database = client.db('interviewDB')
    const collection = database.collection('interviews')
    const historicalData = await collection.find({ job_role: jobRole }).limit(5).toArray()

    // Construct the prompt for the Gemini model
    const prompt = `
      You are an AI expert analyzing interview responses. Below are the candidate's responses for the role of ${jobRole} with a tech stack of ${jobDescription} and ${yearsExperience} years of experience. Also, consider the following historical data from similar interviews: ${JSON.stringify(
        historicalData
      )}. Provide detailed feedback for each response, focusing on relevance, depth, and clarity, and predict a score (0-10) based on the responses and historical data.

      Responses:
      ${responses.map((r: string, i: number) => `Response ${i + 1}: ${r || 'No response provided.'}`).join('\n')}

      Format the output as:
      - Feedback for each response: "Response X: [Your feedback here]"
      - Predicted score: A number out of 10
    `

    // Call the Gemini model
    const resultContent = await model.generateContent(prompt)
    const responseText = await resultContent.response.text()
    console.log('Raw prediction response:', responseText)

    // Parse the response
    const feedbackLines = responseText
      .split('\n')
      .filter(line => line.trim().startsWith('Response'))
    const scoreLine = responseText
      .split('\n')
      .find(line => line.toLowerCase().includes('predicted score'))
    const totalScore = scoreLine ? parseInt(scoreLine.match(/\d+/)?.[0] || '5', 10) : 5

    return NextResponse.json({ feedback: feedbackLines, score: totalScore }, { status: 200 })
  } catch (error) {
    console.error('Error predicting feedback:', error)
    return NextResponse.json({ error: 'Failed to predict feedback' }, { status: 500 })
  }
}