import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory metadata storage
// In production, use a database
const metadataStore: { [key: string]: any } = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicId, artistName, imageLink, genres, tones } = body;

    if (!publicId || !artistName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store metadata
    metadataStore[publicId] = {
      artistName,
      imageLink: imageLink || '',
      genres: genres || [],
      tones: tones || [],
      uploadedAt: new Date().toISOString(),
    };

    console.log('Stored metadata for', publicId, ':', metadataStore[publicId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Metadata storage error:', error);
    return NextResponse.json(
      { error: 'Failed to store metadata' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ metadata: metadataStore });
    }

    const metadata = metadataStore[publicId];
    return NextResponse.json({ metadata });
  } catch (error) {
    console.error('Metadata retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metadata' },
      { status: 500 }
    );
  }
} 