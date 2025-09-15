import { NextResponse } from 'next/server';

export async function GET() {
  // Check if environment variables are available
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    hasModel: !!model,
    apiKeyLength: apiKey ? apiKey.length : 0,
    model: model || 'not set',
    isServer: typeof window === 'undefined'
  });
}