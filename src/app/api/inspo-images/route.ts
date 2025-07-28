import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

async function fetchUnsplash(query: string) {
  if (!UNSPLASH_ACCESS_KEY) return [];
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((img: any) => ({
    src: img.urls?.regular,
    thumb: img.urls?.thumb,
    alt: img.alt_description || img.description || '',
    link: img.links?.html,
    source: 'unsplash',
  }));
}

async function fetchPexels(query: string) {
  if (!PEXELS_API_KEY) return [];
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`, {
    headers: { Authorization: PEXELS_API_KEY },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.photos || []).map((img: any) => ({
    src: img.src?.large,
    thumb: img.src?.tiny,
    alt: img.alt || '',
    link: img.url,
    source: 'pexels',
  }));
}

async function fetchPixabay(query: string) {
  if (!PIXABAY_API_KEY) return [];
  const res = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=12`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.hits || []).map((img: any) => ({
    src: img.webformatURL,
    thumb: img.previewURL,
    alt: img.tags || '',
    link: img.pageURL,
    source: 'pixabay',
  }));
}

async function fetchUserUploads(genre: string, tone: string) {
  try {
    console.log('Fetching user uploads from Cloudinary...');
    const cloudinary = await import('cloudinary');
    
    // Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Cloudinary config:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing',
    });

    // Search for images in the doodle-noodle-inspo folder
    const result = await cloudinary.v2.search
      .expression('folder:doodle-noodle-inspo')
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    console.log('Cloudinary search result:', result);
    const uploads = result.resources || [];
    
    console.log('Found uploads:', uploads.length);
    console.log('Search criteria - genre:', genre, 'tone:', tone);
    
    // Get stored metadata from global scope (fallback only)
    let storedMetadata = (global as any).uploadMetadata || {};
    
    console.log('Retrieved metadata from global scope:', storedMetadata);
    
    return uploads
      .filter((upload: any) => {
        // Get metadata from stored metadata first, then fallback to Cloudinary context
        const metadata = storedMetadata[upload.public_id];
        const tags = upload.tags || [];
        const context = upload.context || {};
        const customMetadata = upload.custom_metadata || {};
        
        // Use stored metadata if available, otherwise fallback to Cloudinary data
        let artistName = metadata?.artistName || 'Unknown Artist';
        let imageLink = metadata?.imageLink || '#';
        let uploadGenres = metadata?.genres || [];
        let uploadTones = metadata?.tones || [];
        
        // Try to parse context string if stored metadata not available
        if (!metadata && context) {
          if (typeof context === 'string') {
            // Parse context string format: "artist_name=...|image_link=...|genres=...|tones=..."
            const contextParts = context.split('|');
            for (const part of contextParts) {
              const [key, value] = part.split('=');
              if (key === 'artist_name') artistName = value || 'Unknown Artist';
              if (key === 'image_link') imageLink = value || '#';
              if (key === 'genres') uploadGenres = value ? value.split(',').map((g: string) => g.trim()) : [];
              if (key === 'tones') uploadTones = value ? value.split(',').map((t: string) => t.trim()) : [];
            }
          } else {
            // Fallback to object format
            artistName = context.artist_name || customMetadata.artist_name || 'Unknown Artist';
            imageLink = context.image_link || customMetadata.image_link || '#';
            uploadGenres = context.genres ? context.genres.split(',').map((g: string) => g.trim()) : 
                          customMetadata.genres ? customMetadata.genres.split(',').map((g: string) => g.trim()) : [];
            uploadTones = context.tones ? context.tones.split(',').map((t: string) => t.trim()) : 
                         customMetadata.tones ? customMetadata.tones.split(',').map((t: string) => t.trim()) : [];
          }
        }
        
        console.log('Upload:', {
          public_id: upload.public_id,
          metadata: metadata,
          tags: tags,
          context: context,
          uploadGenres: uploadGenres,
          uploadTones: uploadTones
        });
        
        // Check if this upload matches the search criteria (OR-based)
        const hasMatchingGenre = !genre || genre === 'Choose a genre...' || 
          uploadGenres.some((g: string) => g.toLowerCase() === genre.toLowerCase()) ||
          tags.some((tag: string) => tag.toLowerCase() === genre.toLowerCase());
        const hasMatchingTone = !tone || tone === 'Pick a tone...' || 
          uploadTones.some((t: string) => t.toLowerCase() === tone.toLowerCase()) ||
          tags.some((tag: string) => tag.toLowerCase() === tone.toLowerCase());
        
        console.log('Match result:', { hasMatchingGenre, hasMatchingTone });
        
        // Temporarily show all uploads for debugging
        return true; // hasMatchingGenre || hasMatchingTone;
      })
      .map((upload: any) => {
        // Get metadata from stored metadata first, then fallback to Cloudinary data
        const metadata = storedMetadata[upload.public_id];
        const context = upload.context || {};
        const customMetadata = upload.custom_metadata || {};
        
        const artistName = metadata?.artistName || context.artist_name || customMetadata.artist_name || 'Unknown Artist';
        const imageLink = metadata?.imageLink || context.image_link || customMetadata.image_link || '#';
        const genres = metadata?.genres || (context.genres ? context.genres.split(',').map((g: string) => g.trim()) : 
                      customMetadata.genres ? customMetadata.genres.split(',').map((g: string) => g.trim()) : []);
        const tones = metadata?.tones || (context.tones ? context.tones.split(',').map((t: string) => t.trim()) : 
                     customMetadata.tones ? customMetadata.tones.split(',').map((t: string) => t.trim()) : []);
        
        return {
          src: upload.secure_url,
          alt: `Artwork by ${artistName}`,
          link: imageLink,
          source: 'user-upload',
          artistName: artistName,
          genres: genres,
          tones: tones,
        };
      });
  } catch (error) {
    console.error('Error fetching user uploads:', error);
    return [];
  }
}

export async function GET(req: NextRequest) {
  console.log('Inspo images API called');
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get('genre') || '';
  const tone = searchParams.get('tone') || '';
  const keywords = searchParams.get('keywords') || '';
  const query = [genre, tone, keywords].filter(Boolean).join(' ');
  const artQuery = (query ? query + ' art' : 'art');
  
  console.log('Search params:', { genre, tone, keywords, query, artQuery });
  
  if (!query) {
    console.log('No query, returning empty array');
    return NextResponse.json({ images: [] });
  }
  const [unsplash, pexels, pixabay, userUploads] = await Promise.all([
    fetchUnsplash(artQuery),
    fetchPexels(artQuery),
    fetchPixabay(artQuery),
    fetchUserUploads(genre, tone),
  ]);
  // Shuffle and merge results, but put user uploads first
  const all = [...userUploads, ...unsplash, ...pexels, ...pixabay]
    .sort(() => Math.random() - 0.5);
  return NextResponse.json({ images: all });
} 