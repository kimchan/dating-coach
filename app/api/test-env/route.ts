import { NextResponse } from 'next/server';

export async function GET() {
  // Check if environment variables are available
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    hasModel: !!model,
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : null,
    model: model || 'not set',
    isServer: typeof window === 'undefined'
  });
}