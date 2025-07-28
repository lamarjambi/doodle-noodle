import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for development
// In production, you'd use a database
const uploads: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const artistName = formData.get('artistName') as string;
    const imageLink = formData.get('imageLink') as string;
    const genres = formData.get('genres') as string;
    const tones = formData.get('tones') as string;

    if (!image || !artistName || !genres || !tones) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to base64 for storage
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${image.type};base64,${base64}`;

    // Create metadata object
    const metadata = {
      id: Date.now(),
      artistName,
      imageLink: imageLink || '',
      genres: genres.split(',').map((g: string) => g.trim()),
      tones: tones.split(',').map((t: string) => t.trim()),
      uploadedAt: new Date().toISOString(),
      dataUrl: dataUrl,
    };

    // Store in memory (for development)
    uploads.push(metadata);
    (global as any).uploads = uploads;

    return NextResponse.json({
      success: true,
      image: {
        src: dataUrl,
        alt: `Artwork by ${artistName}`,
        link: imageLink || '#',
        source: 'user-upload',
        artistName,
        genres: metadata.genres,
        tones: metadata.tones,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to upload image: ${errorMessage}` },
      { status: 500 }
    );
  }
} 