// API endpoint for bio crafting
import { analyzeBio } from '@/lib/openrouter';
import { NextResponse } from 'next/server';
import TONES from '@/lib/tones';

export async function POST(request: Request) {
  console.log("=== BIO-CRAFT API ROUTE CALLED ===");
  
  try {
    const { 
      selectedTones, 
      interests, 
      occupation, 
      personality, 
      lookingFor 
    } = await request.json();

    console.log("Received request with data:", {
      selectedTones,
      interests,
      occupation,
      personality,
      lookingFor
    });

    // Validate inputs
    if (!selectedTones || selectedTones.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one tone' },
        { status: 400 }
      );
    }

    if (!interests || !interests.trim()) {
      return NextResponse.json(
        { error: 'Please enter some interests' },
        { status: 400 }
      );
    }

    // Create a prompt for the LLM based on user inputs and selected tones
    const toneDescriptions = TONES.filter(tone => selectedTones.includes(tone.id))
      .map(tone => `${tone.name}: ${tone.description}`)
      .join('; ');

    const prompt = `Create a dating app bio with the following characteristics:
Tones: ${toneDescriptions}
Interests: ${interests}
Occupation: ${occupation || 'Not specified'}
Personality traits: ${personality || 'Not specified'}
Looking for: ${lookingFor || 'Not specified'}

Instructions:
1. Create a concise, engaging dating app bio (2-4 sentences)
2. Incorporate the selected tones naturally
3. Include the interests in a natural way
4. Make it sound authentic and not like a template
5. Keep it positive and inviting
6. Do not include any markdown or special formatting

Bio:`;

    // Call the LLM through our analyzeBio function with custom prompt
    // For bio generation, we pass the user details as the "bio" parameter
    const userDetails = `User details for bio creation:
Interests: ${interests}
Occupation: ${occupation || 'Not specified'}
Personality traits: ${personality || 'Not specified'}
Looking for: ${lookingFor || 'Not specified'}`;
    
    const result = await analyzeBio(userDetails, { customPrompt: prompt });
    
    return NextResponse.json({
      content: result.recommendedBio,
      toneIds: selectedTones
    });
  } catch (error) {
    console.error('Error generating bio:', error);
    return NextResponse.json(
      { error: 'Failed to generate bio. Please try again.' },
      { status: 500 }
    );
  }
}