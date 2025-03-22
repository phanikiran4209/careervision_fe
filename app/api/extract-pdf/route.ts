import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type. Please upload a PDF." }, { status: 400 });
    }

    // Convert the uploaded file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Buffer size:", buffer.length); // Debug: Ensure buffer is created

    // Parse the PDF buffer
    let data;
    try {
      data = await pdfParse(buffer);
    } catch (parseError) {
      console.error("PDF parsing failed:", parseError);
      return NextResponse.json({ error: "Failed to parse PDF content" }, { status: 400 });
    }

    const text = data.text;
    console.log("Extracted text length:", text.length); // Debug: Verify text extraction

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text could be extracted from the PDF" }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in /api/extract-pdf:", error);
    return NextResponse.json(
      { error: "Failed to extract text from PDF: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST to upload a PDF." }, { status: 405 });
}