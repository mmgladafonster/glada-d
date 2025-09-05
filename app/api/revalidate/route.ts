// ISR Revalidation API for Glada Fönster SEO Pages
// Allows manual revalidation of specific service-location pages

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isValidCombination } from '@/scripts/filterPages';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Check for secret token
  const secret = searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid token' }, 
      { status: 401 }
    );
  }
  
  const service = searchParams.get('service');
  const location = searchParams.get('location');
  
  // Validate required parameters
  if (!service || !location) {
    return NextResponse.json(
      { message: 'Missing service or location parameter' },
      { status: 400 }
    );
  }
  
  // Validate combination exists
  if (!isValidCombination(service, location)) {
    return NextResponse.json(
      { message: 'Invalid service-location combination' },
      { status: 400 }
    );
  }
  
  try {
    // Revalidate the specific page
    const path = `/tjanster/${service}/${location}`;
    await revalidatePath(path);
    
    // Also revalidate sitemap
    await revalidatePath('/sitemap.xml');
    
    return NextResponse.json({ 
      revalidated: true, 
      path,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating page' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, service, location } = body;
    
    // Check for secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid token' }, 
        { status: 401 }
      );
    }
    
    // Validate required parameters
    if (!service || !location) {
      return NextResponse.json(
        { message: 'Missing service or location parameter' },
        { status: 400 }
      );
    }
    
    // Validate combination exists
    if (!isValidCombination(service, location)) {
      return NextResponse.json(
        { message: 'Invalid service-location combination' },
        { status: 400 }
      );
    }
    
    // Revalidate the specific page
    const path = `/tjanster/${service}/${location}`;
    await revalidatePath(path);
    
    // Also revalidate sitemap
    await revalidatePath('/sitemap.xml');
    
    return NextResponse.json({ 
      revalidated: true, 
      path,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating page' },
      { status: 500 }
    );
  }
}

// Batch revalidation endpoint
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Check for secret token
  const secret = searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid token' }, 
      { status: 401 }
    );
  }
  
  try {
    // Revalidate all service pages
    await revalidatePath('/tjanster/[service]/[location]', 'page');
    
    // Revalidate sitemap
    await revalidatePath('/sitemap.xml');
    
    return NextResponse.json({ 
      revalidated: true, 
      scope: 'all-service-pages',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating pages' },
      { status: 500 }
    );
  }
}