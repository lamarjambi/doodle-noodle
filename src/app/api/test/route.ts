import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cloudinary = await import('cloudinary');
    cloudinary.v2.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Search for all images in the doodle-noodle-inspo folder
    const result = await cloudinary.v2.search
      .expression('folder:doodle-noodle-inspo')
      .sort_by('created_at', 'desc')
      .max_results(10)
      .execute();

    const uploads = result.resources || [];
    
    // Get stored metadata from global scope
    const storedMetadata = (global as any).uploadMetadata || {};
    
    const processedUploads = uploads.map((upload: any) => {
      const metadata = storedMetadata[upload.public_id];
      const context = upload.context || {};
      const customMetadata = upload.custom_metadata || {};
      const tags = upload.tags || [];
      
      return {
        public_id: upload.public_id,
        secure_url: upload.secure_url,
        storedMetadata: metadata,
        context: context,
        customMetadata: customMetadata,
        tags: tags,
        // Extract metadata
        artistName: metadata?.artistName || context.artist_name || customMetadata.artist_name || 'Unknown Artist',
        genres: metadata?.genres || (context.genres ? context.genres.split(',').map((g: string) => g.trim()) : 
                customMetadata.genres ? customMetadata.genres.split(',').map((g: string) => g.trim()) : []),
        tones: metadata?.tones || (context.tones ? context.tones.split(',').map((t: string) => t.trim()) : 
               customMetadata.tones ? customMetadata.tones.split(',').map((t: string) => t.trim()) : [])
      };
    });

    return NextResponse.json({
      totalUploads: uploads.length,
      uploads: processedUploads,
      globalMetadataKeys: Object.keys(storedMetadata)
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test data' },
      { status: 500 }
    );
  }
} 