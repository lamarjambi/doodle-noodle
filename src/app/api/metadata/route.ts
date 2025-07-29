import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Store metadata in PostgreSQL database
    const metadata = await prisma.imageMetadata.upsert({
      where: { publicId },
      update: {
        artistName,
        imageLink: imageLink || '',
        genres: genres || [],
        tones: tones || [],
      },
      create: {
        publicId,
        artistName,
        imageLink: imageLink || '',
        genres: genres || [],
        tones: tones || [],
      },
    });

    console.log('Stored metadata for', publicId, ':', metadata);

    return NextResponse.json({ success: true, metadata });
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
      // Return all metadata if no specific publicId
      const allMetadata = await prisma.imageMetadata.findMany({
        orderBy: { uploadedAt: 'desc' }
      });
      return NextResponse.json({ metadata: allMetadata });
    }

    // Get specific metadata from database
    const metadata = await prisma.imageMetadata.findUnique({
      where: { publicId }
    });

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
      
      return NextResponse.json({ 
        metadata,
        cloudinaryMetadata: cloudinaryMetadata,
      });
    } catch (cloudinaryError) {
      console.error('Error fetching from Cloudinary:', cloudinaryError);
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