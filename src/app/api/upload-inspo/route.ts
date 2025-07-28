import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = image.name.split('.').pop();
    const filename = `inspo-${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create metadata file to store additional info
    const metadata = {
      id: timestamp,
      filename,
      artistName,
      imageLink: imageLink || '',
      genres: genres.split(',').map(g => g.trim()),
      tones: tones.split(',').map(t => t.trim()),
      uploadedAt: new Date().toISOString(),
    };

    const metadataPath = join(uploadsDir, `${timestamp}.json`);
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      image: {
        src: `/uploads/${filename}`,
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
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 