import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    
    // Read file from local storage
    const relativePath = filePath.replace('/api/uploads/', '');
    const fullPath = `${process.cwd()}/local-data/uploads/${relativePath}`;
    
    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(fullPath);
    } catch (error) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.json': 'application/json',
    };
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Error serving file', { status: 500 });
  }
}

