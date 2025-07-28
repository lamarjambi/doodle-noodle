import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  console.log('Upload API called');
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const artistName = formData.get('artistName') as string;
    const imageLink = formData.get('imageLink') as string;
    const genres = formData.get('genres') as string;
    const tones = formData.get('tones') as string;

    console.log('Form data received:', { 
      hasImage: !!image, 
      artistName, 
      imageLink, 
      genres, 
      tones 
    });

    if (!image || !artistName || !genres || !tones) {
      console.log('Missing required fields');
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

    // Convert file to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    console.log('Starting Cloudinary upload...');
    console.log('Upload metadata:', { artistName, genres, tones, imageLink });
    
    const timestamp = Date.now();
    const publicId = `inspo-${timestamp}`;
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'doodle-noodle-inspo',
          public_id: publicId,
          resource_type: 'image',
          tags: [...genres.split(',').map((g: string) => g.trim()), ...tones.split(',').map((t: string) => t.trim())],
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const cloudinaryResult = result as any;

    // Store metadata in global scope for now
    const metadata = {
      publicId: cloudinaryResult.public_id,
      artistName,
      imageLink: imageLink || '',
      genres: genres.split(',').map((g: string) => g.trim()),
      tones: tones.split(',').map((t: string) => t.trim()),
    };

    // Store in global scope
    if (!(global as any).uploadMetadata) {
      (global as any).uploadMetadata = {};
    }
    (global as any).uploadMetadata[cloudinaryResult.public_id] = metadata;

    console.log('Stored metadata for', cloudinaryResult.public_id, ':', metadata);

    // Store metadata in Cloudinary context for persistence
    try {
      const cloudinary = await import('cloudinary');
      cloudinary.v2.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      
      // Store metadata in both context and custom_metadata for better retrieval
      await cloudinary.v2.uploader.explicit(cloudinaryResult.public_id, {
        type: 'upload',
        context: {
          artist_name: artistName,
          image_link: imageLink || '',
          genres: genres,
          tones: tones,
        },
        custom_metadata: {
          artist_name: artistName,
          image_link: imageLink || '',
          genres: genres,
          tones: tones,
        },
        // Also add tags for easier filtering
        tags: [...genres.split(',').map((g: string) => g.trim()), ...tones.split(',').map((t: string) => t.trim())]
      });
      console.log('Metadata saved to Cloudinary');
    } catch (error) {
      console.error('Error saving metadata to Cloudinary:', error);
    }

    return NextResponse.json({
      success: true,
      image: {
        src: cloudinaryResult.secure_url,
        alt: `Artwork by ${artistName}`,
        link: imageLink || '#',
        source: 'user-upload',
        artistName,
        genres: metadata.genres,
        tones: metadata.tones,
        publicId: cloudinaryResult.public_id,
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