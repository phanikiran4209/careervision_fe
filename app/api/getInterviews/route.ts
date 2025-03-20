import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

export async function GET(_: NextApiRequest, res: NextApiResponse) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("interviewDB");
    const collection = database.collection("interviews");
    const interviews = await collection.find({}).sort({ created_at: -1 }).toArray();
    return res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({ error: "Failed to fetch interviews" });
  } finally {
    await client.close();
  }
}