import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  jobRole: { type: String, required: true },
  jobDescription: { type: String, required: true },
  yearsExperience: { type: Number, required: true },
  questions: { type: [String], required: true },
  responses: { type: [String], default: [] },
  feedback: { type: [String], default: [] },
  score: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);