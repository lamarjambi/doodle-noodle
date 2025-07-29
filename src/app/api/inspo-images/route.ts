import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    console.log('Fetching user uploads from database...');
    console.log('Search criteria - genre:', genre, 'tone:', tone);
    
    // Fetch all metadata from database
    const allMetadata = await prisma.imageMetadata.findMany({
      orderBy: { uploadedAt: 'desc' }
    });
    
    console.log('Found metadata records:', allMetadata.length);
    
    return allMetadata
      .filter((metadata) => {
        // Check if this upload matches the search criteria (OR-based)
        const hasMatchingGenre = !genre || genre === 'Choose a genre...' || 
          metadata.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase());
        const hasMatchingTone = !tone || tone === 'Pick a tone...' || 
          metadata.tones.some((t: string) => t.toLowerCase() === tone.toLowerCase());
        
        console.log('Processing metadata:', {
          publicId: metadata.publicId,
          genres: metadata.genres,
          tones: metadata.tones,
          hasMatchingGenre,
          hasMatchingTone
        });
        
        // Return true if either genre or tone matches (OR logic)
        return hasMatchingGenre || hasMatchingTone;
      })
      .map((metadata) => {
        return {
          src: metadata.imageLink || '#',
          alt: `Artwork by ${metadata.artistName}`,
          link: metadata.imageLink || '#',
          source: 'user-upload',
          artistName: metadata.artistName,
          genres: metadata.genres,
          tones: metadata.tones,
        };
      });
  } catch (error) {
    console.error('Error fetching user uploads from database:', error);
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