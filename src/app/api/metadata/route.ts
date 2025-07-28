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

    // Try to get metadata from Cloudinary as well
    try {
      const cloudinary = await import('cloudinary');
      cloudinary.v2.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await cloudinary.v2.api.resource(publicId, {
        type: 'upload'
      });

      const cloudinaryMetadata = {
        context: result.context || {},
        custom_metadata: result.custom_metadata || {},
        tags: result.tags || [],
        public_id: result.public_id,
        secure_url: result.secure_url
      };

      const localMetadata = metadataStore[publicId];
      
      return NextResponse.json({ 
        metadata: localMetadata,
        cloudinaryMetadata: cloudinaryMetadata,
        globalMetadata: (global as any).uploadMetadata?.[publicId]
      });
    } catch (cloudinaryError) {
      console.error('Error fetching from Cloudinary:', cloudinaryError);
      const metadata = metadataStore[publicId];
      return NextResponse.json({ metadata });
    }
  } catch (error) {
    console.error('Metadata retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metadata' },
      { status: 500 }
    );
  }
} 