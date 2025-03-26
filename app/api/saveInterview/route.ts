import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

// Environment variable for MongoDB URI
const uri = process.env.MONGODB_URI || ''

// Singleton MongoDB client for connection pooling
let client: MongoClient
let clientPromise: Promise<MongoClient> = new MongoClient(uri).connect()

if (!clientPromise) {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { jobRole, jobDescription, yearsExperience, questions, responses, feedback, score } = await request.json()

    // Validate required fields
    if (!jobRole || !jobDescription || !yearsExperience || !questions || !responses) {
      return NextResponse.json({ error: 'Missing required fields: jobRole, jobDescription, yearsExperience, questions, and responses are required' }, { status: 400 })
    }

    // Validate data types
    if (typeof jobRole !== 'string' || typeof jobDescription !== 'string' || !Array.isArray(questions) || !Array.isArray(responses)) {
      return NextResponse.json({ error: 'Invalid data types: jobRole and jobDescription must be strings, questions and responses must be arrays' }, { status: 400 })
    }

    // Validate yearsExperience
    const parsedYearsExperience = parseInt(yearsExperience, 10)
    if (isNaN(parsedYearsExperience) || parsedYearsExperience < 0) {
      return NextResponse.json({ error: 'Invalid yearsExperience: must be a non-negative number' }, { status: 400 })
    }

    // Validate feedback and score (optional fields)
    const validatedFeedback = Array.isArray(feedback) ? feedback : []
    const validatedScore = typeof score === 'number' && score >= 0 && score <= 10 ? score : null

    // Connect to MongoDB
    const client = await clientPromise
    const database = client.db('interviewDB')
    const collection = database.collection('interviews')

    // Insert the interview data
    const result = await collection.insertOne({
      job_role: jobRole,
      job_description: jobDescription,
      years_experience: parsedYearsExperience,
      questions,
      responses,
      feedback: validatedFeedback,
      score: validatedScore,
      created_at: new Date(),
    })

    return NextResponse.json({ message: 'Interview saved', interviewId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error saving interview:', error)
    return NextResponse.json({ error: 'Failed to save interview' }, { status: 500 })
  }
}