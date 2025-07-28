import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      return [];
    }

    const files = await readdir(uploadsDir);
    const metadataFiles = files.filter(file => file.endsWith('.json'));
    
    const userImages = [];

    for (const metadataFile of metadataFiles) {
      try {
        const metadataPath = join(uploadsDir, metadataFile);
        const metadataContent = await readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);

        // Check if image file exists
        const imagePath = join(uploadsDir, metadata.filename);
        if (!existsSync(imagePath)) continue;

        // Filter by genre and tone if specified - show if ANY tag matches
        let shouldInclude = false;
        
        // If no filters are specified, include all images
        if (!genre && !tone) {
          shouldInclude = true;
        } else {
          // Check if ANY of the search criteria match the image tags
          if (genre) {
            const genreMatches = metadata.genres.some((g: string) => 
              g.toLowerCase().includes(genre.toLowerCase())
            );
            if (genreMatches) shouldInclude = true;
          }
          
          if (tone) {
            const toneMatches = metadata.tones.some((t: string) => 
              t.toLowerCase().includes(tone.toLowerCase())
            );
            if (toneMatches) shouldInclude = true;
          }
        }
        
        if (!shouldInclude) {
          continue;
        }

        userImages.push({
          src: `/uploads/${metadata.filename}`,
          alt: `Artwork by ${metadata.artistName}`,
          link: metadata.imageLink || '#',
          source: 'user-upload',
          artistName: metadata.artistName,
          genres: metadata.genres,
          tones: metadata.tones,
          uploadedAt: metadata.uploadedAt,
        });
      } catch (error) {
        console.error(`Error reading metadata file ${metadataFile}:`, error);
        continue;
      }
    }

    // Sort by upload date (newest first)
    userImages.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return userImages;

  } catch (error) {
    console.error('Error fetching user uploads:', error);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get('genre') || '';
  const tone = searchParams.get('tone') || '';
  const keywords = searchParams.get('keywords') || '';
  const query = [genre, tone, keywords].filter(Boolean).join(' ');
  const artQuery = (query ? query + ' art' : 'art');
  if (!query) {
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