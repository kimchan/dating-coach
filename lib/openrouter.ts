// API utility for OpenRouter integration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL; // No fallback, only use what's in .env.local
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Detailed logging for debugging
console.log("=== OPENROUTER ENVIRONMENT VARIABLE DEBUGGING ===");
console.log("All process.env keys:", Object.keys(process.env));
console.log("process.env keys related to OPENROUTER:", Object.keys(process.env).filter(key => key.includes('OPENROUTER')));
console.log("OPENROUTER_API_KEY present:", !!OPENROUTER_API_KEY);
console.log("OPENROUTER_API_KEY value:", OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 10)}...` : 'undefined');
console.log("OPENROUTER_MODEL:", OPENROUTER_MODEL);
console.log("==================================================");

export interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  overall: string;
  recommendedBio: string;
}

export async function analyzeBio(bio: string): Promise<AnalysisResult> {
  console.log("=== ANALYZEBIO FUNCTION DEBUGGING ===");
  console.log("analyzeBio called with bio:", bio);
  console.log("OPENROUTER_API_KEY available in function:", !!OPENROUTER_API_KEY);
  console.log("OPENROUTER_API_KEY value:", OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 10)}...` : 'undefined');
  console.log("OPENROUTER_MODEL value:", OPENROUTER_MODEL);
  
  // Check if we're in a server environment
  const isServer = typeof window === 'undefined';
  console.log("Running on server:", isServer);
  
  // Additional logging to debug environment variable loading
  console.log("All env vars keys:", Object.keys(process.env).filter(key => key.includes('OPENROUTER')));
  console.log("Process env OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? `${process.env.OPENROUTER_API_KEY.substring(0, 10)}...` : 'undefined');
  console.log("=====================================");
  
  // Check if we have both the API key and model
  if (!OPENROUTER_API_KEY || !OPENROUTER_MODEL) {
    console.log("Using MOCK DATA because either OPENROUTER_API_KEY or OPENROUTER_MODEL is not set or is falsy");
    console.log("OPENROUTER_API_KEY present:", !!OPENROUTER_API_KEY);
    console.log("OPENROUTER_MODEL present:", !!OPENROUTER_MODEL);
    console.log("OPENROUTER_MODEL value:", OPENROUTER_MODEL);
    // Return mock data based on actual input
    if (bio.trim().length === 0) {
      return {
        score: 0,
        strengths: [],
        improvements: [
          "A completely empty bio won't attract any matches - you need to share something about yourself",
          "Include specific interests or hobbies to give people something to connect with",
          "Add a conversation starter question to encourage responses"
        ],
        overall: "An empty bio is the worst possible approach on dating apps. You need to share something about yourself to attract potential matches.",
        recommendedBio: `Weekend warrior who once got lost for 6 hours but still made it back with an amazing sunset photo \ud83d\udcf8
Looking for someone who can laugh at my terrible sense of direction and enjoys spontaneous adventures.

What's the weirdest thing you've seen on an adventure?`
      };
    }
    
    if (bio.toLowerCase().includes('hi') && bio.trim().length < 10) {
      return {
        score: 25,
        strengths: [
          "You started with a friendly greeting"
        ],
        improvements: [
          "A dating bio needs much more than just a greeting - share who you are and what you're looking for",
          "Include specific interests or hobbies to give people something to connect with",
          "Add a conversation starter question to encourage responses"
        ],
        overall: "Your bio is just a greeting with minimal content, which doesn't tell potential matches anything about you. A good dating bio should share specific details about your personality, interests, and what you're looking for.",
        recommendedBio: `Hi! I'm a weekend adventurer who's either hiking trails or trying new coffee shops.
Currently obsessed with finding the city's best tacos and terrible at karaoke.
Looking for someone who can handle my dad jokes and spontaneous dance parties.

What's the most random thing you're passionate about?`
      };
    }
    
    // Generic fallback for other inputs
    return {
      score: 45,
      strengths: [
        "You took the time to write something"
      ],
      improvements: [
        "Share specific details about your actual interests and experiences",
        "Include what you're genuinely looking for in a match",
        "Add a conversation starter to engage potential matches"
      ],
      overall: "Your bio needs more specific details about who you are and what you're looking for. Generic statements don't help potential matches get to know the real you.",
      recommendedBio: `Weekend warrior who once got lost for 6 hours but still made it back with an amazing sunset photo \ud83d\udcf8
Looking for someone who can laugh at my terrible sense of direction and enjoys spontaneous adventures.

What's the weirdest thing you've seen on an adventure?`
    };
  }

  console.log("Using ACTUAL LLM for analysis");
  console.log("Making request to:", OPENROUTER_API_URL);
  console.log("Using model:", OPENROUTER_MODEL);
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kims-dating-coach.com", // Optional, for tracking
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a highly experienced dating coach who evaluates dating app bios using a strict but fair scoring system based on proven effectiveness principles.

SCORING STRATEGY (Max 100 points):
1. CLARITY & PURPOSE (25 points)
   - Clear communication of who you are
   - Evidence of self-awareness
   - Clear intent (looking for what?)

2. ENGAGEMENT FACTORS (25 points)
   - Conversation starters (questions, stories)
   - Unique or memorable elements
   - Hooks that make someone want to swipe right

3. AUTHENTICITY (25 points)
   - Genuine personality expression
   - Specific examples over generic statements
   - Avoidance of clich\\u00e9s and overused phrases

4. PRESENTATION (25 points)
   - Good grammar and spelling
   - Proper length (not too short or long)
   - Well-structured with clear flow

SCORING SCALE:
90-100: Exceptional - Highly likely to generate matches
75-89: Strong - Good foundation with minor improvements needed
60-74: Average - Needs significant work to be effective
45-59: Below Average - Major improvements needed
30-44: Poor - Unlikely to generate matches
0-29: Very Poor - Actively hurts chances

CRITICAL SCORING INSTRUCTIONS:
1. Bios with very little effort (e.g., just "Hi", very short generic phrases, or minimal content) should score 0-29
2. Bios with minimal content but some effort should score 30-44
3. Base ALL feedback specifically on the user's actual bio content provided below
4. Reference specific words, phrases, or elements from their actual bio in your feedback
5. DO NOT make up examples or mention things not in their bio
6. If their bio is very short, acknowledge that directly and score accordingly
7. Point out specific strengths by quoting or referencing their actual text
8. Identify specific areas for improvement based exactly on what they wrote
9. The recommended bio should be a complete rewrite of their actual bio, not a template
10. NEVER mention hiking, tacos, karaoke, or other examples unless they are in their actual bio

IMPORTANT: Return your response as a JSON object with this exact structure:
{
  "score": 75,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "overall": "overall feedback text",
  "recommendedBio": "recommended bio text"
}

The user's actual bio is provided in the next message. Analyze ONLY that content and return ONLY the JSON object.`
          },
          {
            role: "user",
            content: `Here is the dating app bio to analyze:\n\n${bio}`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Log the raw response for debugging
    console.log("Raw API response:", JSON.stringify(data, null, 2));
    
    // Parse the JSON response from the AI
    let analysis;
    if (typeof data.choices[0].message.content === 'string') {
      // Try to parse as JSON first
      try {
        // Handle markdown code blocks that some models wrap JSON in
        let content = data.choices[0].message.content.trim();
        if (content.startsWith('```json')) {
          content = content.substring(7); // Remove ```json
        }
        if (content.startsWith('```')) {
          content = content.substring(3); // Remove ```
        }
        if (content.endsWith('```')) {
          content = content.substring(0, content.length - 3); // Remove ```
        }
        content = content.trim();
        
        analysis = JSON.parse(content);
      } catch (parseError) {
        // If parsing fails, log the error and return mock data
        console.error("Error parsing LLM response as JSON:", parseError);
        console.log("LLM response content:", data.choices[0].message.content);
        throw new Error("LLM response is not valid JSON");
      }
    } else {
      analysis = data.choices[0].message.content;
    }
    
    // Validate that we have the expected structure
    if (!analysis.score || !Array.isArray(analysis.strengths) || !Array.isArray(analysis.improvements) || !analysis.overall || !analysis.recommendedBio) {
      throw new Error("LLM response does not have the expected structure");
    }
    
    return {
      score: analysis.score,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      overall: analysis.overall,
      recommendedBio: analysis.recommendedBio
    };
  } catch (error) {
    console.error("Error analyzing bio:", error);
    // Return mock data based on actual input
    if (bio.trim().length === 0) {
      return {
        score: 0,
        strengths: [],
        improvements: [
          "A completely empty bio won't attract any matches - you need to share something about yourself",
          "Include specific interests or hobbies to give people something to connect with",
          "Add a conversation starter question to encourage responses"
        ],
        overall: "An empty bio is the worst possible approach on dating apps. You need to share something about yourself to attract potential matches.",
        recommendedBio: "Weekend warrior who once got lost for 6 hours but still made it back with an amazing sunset photo \\ud83d\\udcf8\nLooking for someone who can laugh at my terrible sense of direction and enjoys spontaneous adventures.\n\nWhat's the weirdest thing you've seen on an adventure?"
      };
    }
    
    // Generic fallback for other inputs
    return {
      score: 45,
      strengths: [
        "You took the time to write something"
      ],
      improvements: [
        "Share specific details about your actual interests and experiences",
        "Include what you're genuinely looking for in a match",
        "Add a conversation starter to engage potential matches"
      ],
      overall: "Your bio needs more specific details about who you are and what you're looking for. Generic statements don't help potential matches get to know the real you.",
      recommendedBio: "Weekend warrior who once got lost for 6 hours but still made it back with an amazing sunset photo \\ud83d\\udcf8\nLooking for someone who can laugh at my terrible sense of direction and enjoys spontaneous adventures.\n\nWhat's the weirdest thing you've seen on an adventure?"
    };
  }
}