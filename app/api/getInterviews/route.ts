import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

export async function GET(_req: NextRequest) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('interviewDB')
    const collection = database.collection('interviews')
    const interviews = await collection.find({}).sort({ created_at: -1 }).toArray()
    return NextResponse.json(interviews, { status: 200 })
  } catch (error) {
    console.error('Error fetching interviews:', error)
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 })
  } finally {
    await client.close()
  }
}