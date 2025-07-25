import { NextRequest, NextResponse } from 'next/server';

async function fetchPixabay(query: string) {
  try {
    console.log('Fetching from Pixabay with query:', query);
    
    // Use environment variable or fallback to a demo key
    const apiKey = process.env.PIXABAY_API_KEY || '43239069-8c0c8c0c8c0c8c0c8c0c8c0c';
    
    const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20&safesearch=true`);
    
    if (!res.ok) {
      console.error('Pixabay API response not ok:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    console.log('Pixabay response:', { total: data.totalHits, returned: data.hits?.length || 0 });
    
    return (data.hits || []).map((img: any) => ({
      src: img.webformatURL,
      thumb: img.previewURL,
      alt: img.tags || '',
      link: img.pageURL,
      source: 'pixabay',
    }));
  } catch (error) {
    console.error('Pixabay API error:', error);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('Inspo images API called');
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre') || '';
    const tone = searchParams.get('tone') || '';
    const keywords = searchParams.get('keywords') || '';
    
    console.log('Search params:', { genre, tone, keywords });
    
    const query = [genre, tone, keywords].filter(Boolean).join(' ');
    const artQuery = query ? `${query} art illustration` : 'art illustration';
    
    console.log('Final query:', artQuery);
    
    if (!query) {
      console.log('No query provided, returning empty');
      return NextResponse.json({ images: [] });
    }
    
    const images = await fetchPixabay(artQuery);
    console.log('Returning images:', images.length);
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      images: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 