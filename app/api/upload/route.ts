import { NextResponse } from 'next/server';
import pdfParse from "pdf-parse"

export async function POST(request:Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse the PDF
    const data = await pdfParse(buffer);
    
    // Return the extracted text
    return NextResponse.json({ 
      text: data.text,
      info: {
        pages: data.numpages,
        metadata: data.metadata,
      }
    });
  } catch (error:any) {
    console.error('PDF parsing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}