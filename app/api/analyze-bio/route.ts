import { NextResponse } from 'next/server';
import { analyzeBio } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    console.log('API route called');
    const { bio } = await request.json();
    console.log('Received bio:', bio);
    
    if (!bio) {
      console.log('No bio provided');
      return NextResponse.json(
        { error: 'Bio is required' },
        { status: 400 }
      );
    }
    
    console.log('Calling analyzeBio function');
    const result = await analyzeBio(bio);
    console.log('Analysis completed, sending response:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze bio' },
      { status: 500 }
    );
  }
}

// Ensure this runs only on the server
export const runtime = 'nodejs';