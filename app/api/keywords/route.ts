import { NextRequest, NextResponse } from 'next/server';
import keywords from '@/lib/keywords.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const intent = searchParams.get('intent');
    const type = searchParams.get('type');

    let filteredKeywords = keywords;

    // Apply filters
    if (service && service !== 'all') {
      filteredKeywords = filteredKeywords.filter(k => k.Service === service);
    }

    if (location && location !== 'all') {
      filteredKeywords = filteredKeywords.filter(k => k.Location === location);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredKeywords = filteredKeywords.filter(k => 
        k.Keyword.toLowerCase().includes(searchTerm) ||
        k.Modifier.toLowerCase().includes(searchTerm)
      );
    }

    if (intent && intent !== 'all') {
      filteredKeywords = filteredKeywords.filter(k => k.Search_Intent === intent);
    }

    if (type && type !== 'all') {
      filteredKeywords = filteredKeywords.filter(k => k.Keyword_Type === type);
    }

    return NextResponse.json({
      success: true,
      count: filteredKeywords.length,
      keywords: filteredKeywords,
      filters: {
        service,
        location,
        search,
        intent,
        type
      }
    });

  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
