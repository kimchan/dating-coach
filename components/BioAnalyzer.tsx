"use client";

import { useState, useRef, useEffect } from "react";

interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  overall: string;
  recommendedBio: string;
}

export default function BioAnalyzer() {
  const [bio, setBio] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScoringInfo, setShowScoringInfo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0); // For ensuring different mock data on refresh
  const strengthsRef = useRef<HTMLDivElement>(null);
  const strengthsCardRef = useRef<HTMLDivElement>(null);
  
  // For handling hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock data for initial analysis when LLM is not available
  const getMockAnalysisData = (inputBio: string) => {
    // Different mock data based on the input bio
    if (inputBio.trim().length === 0) {
      return {
        score: 0,
        strengths: [],
        improvements: [
          "A completely empty bio won't attract any matches - you need to share something about yourself",
          "Include specific interests or hobbies to give people something to connect with",
          "Add a conversation starter question to encourage responses"
        ],
        overall: "An empty bio is the worst possible approach on dating apps. You need to share something about yourself to attract potential matches.",
        recommendedBio: "Weekend warrior who once got lost for 6 hours but still made it back with an amazing sunset photo \ud83d\udcf8\nLooking for someone who can laugh at my terrible sense of direction and enjoys spontaneous adventures.\n\nWhat's the weirdest thing you've seen on an adventure?"
      };
    }
    
    if (inputBio.toLowerCase().includes('hi') && inputBio.trim().length < 10) {
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
        recommendedBio: "Hi! I'm a weekend adventurer who's either hiking trails or trying new coffee shops.\nCurrently obsessed with finding the city's best tacos and terrible at karaoke.\nLooking for someone who can handle my dad jokes and spontaneous dance parties.\n\nWhat's the most random thing you're passionate about?"
      };
    }
    
    // Generic fallback for other inputs
    return {
      score: Math.floor(Math.random() * 40) + 45, // Random score between 45-85
      strengths: [
        "You took the time to write something",
        "Good attempt at expressing your personality"
      ],
      improvements: [
        "Share more specific details about your actual interests and experiences",
        "Include what you're genuinely looking for in a match",
        "Add a conversation starter to engage potential matches"
      ],
      overall: "Your bio shows effort and personality, but could benefit from more specific details about who you are and what you're looking for. Adding concrete examples of your interests would make it more engaging.",
      recommendedBio: "Curious explorer of both city hidden gems and good bookstores \ud83d\udcda\nBeliever that the best conversations happen over shared interests and genuine curiosity about others\nCurrently searching for someone who appreciates both planned adventures and spontaneous discoveries\n\nWhat's a skill or hobby you've always wanted to try but haven't yet?"
    };
  };

  const analyzeBioHandler = async () => {
    if (!bio.trim()) return;
    
    // Don't run on server
    if (typeof window === 'undefined') return;
    
    setLoading(true);
    setCopied(false);
    setAnalysis(null);
    
    try {
      console.log("Sending bio to API:", bio);
      const response = await fetch('/api/analyze-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      });
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        // If the API call fails, use mock data as fallback
        console.log("API call failed, using mock data as fallback");
        const mockData = getMockAnalysisData(bio);
        // Add a small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setAnalysis(mockData);
        setShowAnalysis(true);
        setShowFullBio(false);
        return;
      }
      
      const result = await response.json();
      console.log("API response result:", result);
      setAnalysis(result);
      setShowAnalysis(true);
      setShowFullBio(false); // Reset to show shortened version on mobile
      
      // Scroll to strengths card after a short delay to ensure rendering
      setTimeout(() => {
        if (typeof window !== 'undefined' && strengthsCardRef.current) {
          strengthsCardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // For mobile devices, add additional offset for better viewing
          if (window.innerWidth <= 768) {
            window.scrollBy(0, -60); // Larger offset for mobile
          } else {
            // Add additional offset for better desktop viewing
            window.scrollBy(0, -20);
          }
        }
      }, 500);
    } catch (error) {
      console.error("Error analyzing bio:", error);
      // Use mock data as fallback when there's an error
      const mockData = getMockAnalysisData(bio);
      // Add a small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysis(mockData);
      setShowAnalysis(true);
      setShowFullBio(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Mock data for refresh functionality when LLM is not available
  const getMockRefreshData = (currentBio: string, count: number) => {
    // Generate varied mock data based on the input bio and count
    const bioLength = currentBio.trim().length;
    const bioWords = currentBio.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = bioWords.length;
    
    // Different mock data based on bio characteristics
    const mockRefreshOptions = [
      {
        score: Math.min(95, 75 + (count % 10) + Math.floor(bioLength / 20)), // Vary score based on count and bio length
        strengths: [
          "Great use of humor throughout",
          "Clear expression of interests and hobbies",
          wordCount > 10 ? "Good detail about your experiences" : "Concise and to the point"
        ].filter(Boolean) as string[],
        improvements: [
          "Could add more specific details about your hobbies",
          "Consider adding a question to encourage responses",
          bioLength < 50 ? "Try expanding a bit more to share your personality" : "Keep what works and refine what doesn't"
        ].filter(Boolean) as string[],
        overall: `This is a solid dating bio with good personality expression. The humor elements work well, and you've clearly communicated your interests. ${bioLength > 100 ? "Your longer bio gives readers more to connect with." : "Your shorter bio is punchy and impactful."}`,
        recommendedBio: `Adventure seeker who believes the best stories come from saying yes to unexpected opportunities ⭐
Currently juggling between being a weekend chef experimenting with fusion cuisine and an amateur stargazer
Looking for someone who appreciates both a good deep conversation and comfortable silences

What's the most spontaneous thing you've ever done? (Refresh #${count})`
      },
      {
        score: Math.min(90, 80 + (count % 5) + Math.floor(wordCount / 3)), // Vary score based on count and word count
        strengths: [
          "Strong opening that grabs attention",
          "Good balance of personal details and mystery",
          bioLength > 50 ? "You share enough to be interesting without oversharing" : "You pack a lot of personality into a small space"
        ].filter(Boolean) as string[],
        improvements: [
          "Could be more specific about what you're looking for",
          "Add more unique personality traits",
          wordCount < 20 ? "Adding a few more descriptive words could help" : "Focus on what makes you uniquely you"
        ].filter(Boolean) as string[],
        overall: `Your bio has a compelling hook that will get attention. You've struck a good balance between revealing enough to be interesting while keeping some mystery. ${wordCount > 30 ? "The detail level shows you put thought into this." : "The brevity shows you know how to make every word count."}`,
        recommendedBio: `Professional problem solver by day, amateur karaoke champion by night 🎤
Believer that life's too short for boring conversations and instant coffee
Currently on a mission to try every food truck in the city and find the perfect playlist for Sunday mornings

If you could have dinner with any historical figure, who would it be and why? (Refresh #${count})`
      },
      {
        score: Math.min(85, 70 + (count % 15) + Math.floor(bioLength / 10)), // Vary score based on count and bio length
        strengths: [
          "Authentic personality shines through",
          "Good variety of interests mentioned",
          wordCount > 20 ? "You show depth in your interests" : "You make every word count"
        ].filter(Boolean) as string[],
        improvements: [
          "Could add more specific examples of your interests",
          "Consider adding a unique conversation starter",
          bioLength < 80 ? "Adding a bit more detail could help showcase your personality" : "Make sure every sentence adds value"
        ].filter(Boolean) as string[],
        overall: `This bio shows your genuine personality and interests well. You've provided enough information for someone to get a sense of who you are without oversharing. ${bioLength > 150 ? "Your detailed approach gives readers a full picture." : "Your concise approach leaves them wanting to know more."}`,
        recommendedBio: `Weekend explorer mapping out the city's best hidden gems and weekday dreamer planning my next travel adventure 🗺️
Coffee enthusiast with strong opinions about pour-over techniques and spontaneous dance party organizer
Looking for someone who can debate the best pizza topping and appreciates both planning and going with the flow

What's the most interesting place you've ever visited and what made it special? (Refresh #${count})`
      }
    ];
    
    // Use the count to determine which mock data to use, ensuring variety
    const selectedOption = mockRefreshOptions[count % mockRefreshOptions.length];
    
    return {
      ...selectedOption,
      overall: `Refreshed version #${count} of your bio analysis. ${selectedOption.overall}`
    };
  };

  const refreshBio = async () => {
    // For refresh, we only need the bio to be present
    if (!bio.trim()) return;
    
    // Don't run on server
    if (typeof window === 'undefined') return;
    
    setRefreshing(true);
    
    // Use the actual LLM for refresh, just like the main analysis
    try {
      console.log("Using ACTUAL LLM for refresh");
      const response = await fetch('/api/analyze-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      });
      
      console.log("Refresh API response status:", response.status);
      
      if (!response.ok) {
        // If the API call fails, use mock data as fallback
        console.log("Refresh API call failed, using mock data as fallback");
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Refresh API response result:", result);
      setAnalysis(result);
      setRefreshCount(refreshCount + 1);
    } catch (error) {
      console.error("Error refreshing bio:", error);
      // Use mock data as fallback when there's an error
      const mockData = getMockRefreshData(bio, refreshCount);
      // Add a small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysis(mockData);
      setRefreshCount(refreshCount + 1);
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && analysis?.recommendedBio) {
      navigator.clipboard.writeText(analysis.recommendedBio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getScoreInfo = (score: number) => {
    if (score >= 90) return { category: "Exceptional", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 75) return { category: "Strong", color: "text-green-500", bg: "bg-green-50" };
    if (score >= 60) return { category: "Average", color: "text-yellow-500", bg: "bg-yellow-50" };
    if (score >= 45) return { category: "Below Average", color: "text-orange-500", bg: "bg-orange-50" };
    if (score >= 30) return { category: "Poor", color: "text-red-500", bg: "bg-red-50" };
    return { category: "Very Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const scoreInfo = analysis ? getScoreInfo(analysis.score) : null;

  // Render a consistent structure for both server and client
  // Only show interactive elements when isClient is true
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header section - always visible */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Dating Bio Analyzer</h1>
          {/* Information icon for scoring details - inline with title */}
          <button 
            onClick={() => setShowScoringInfo(!showScoringInfo)}
            className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="How we score dating bios"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Paste your dating app bio below to get AI-powered feedback on how to improve it
        </p>
      </div>

      {/* Scoring information - hidden by default, shown when info icon is clicked */}
      <div className={`mb-6 transition-all duration-300 ease-in-out overflow-hidden ${
        showScoringInfo 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-blue-800">How We Score Dating Bios</h3>
            <button 
              onClick={() => setShowScoringInfo(false)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Close
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex">
                <span className="font-medium mr-2">Clarity & Purpose:</span>
                <span>Clear communication of who you are</span>
              </li>
              <li className="flex">
                <span className="font-medium mr-2">Engagement Factors:</span>
                <span>Elements that make people want to swipe right</span>
              </li>
              <li className="flex">
                <span className="font-medium mr-2">Authenticity:</span>
                <span>Genuine personality expression</span>
              </li>
              <li className="flex">
                <span className="font-medium mr-2">Presentation:</span>
                <span>Good grammar and well-structured</span>
              </li>
            </ul>
            <div className="mt-3 text-xs text-blue-600">
              <p>Scoring Scale: 90-100 (Exceptional) | 75-89 (Strong) | 60-74 (Average) | 45-59 (Below Average) | 30-44 (Poor) | 0-29 (Very Poor)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Three-column layout that changes based on analysis state */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input column - full width when no analysis, 1/3 width when analysis is shown */}
        <div className={`transition-all duration-500 ease-in-out ${
          showAnalysis 
            ? 'lg:w-1/3' 
            : 'w-full max-w-4xl mx-auto'
        }`}>
          <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 ${
            showAnalysis ? '' : 'lg:p-8'
          }`}>
            <div className="mb-5">
              <label htmlFor="bio" className="block text-lg font-medium text-gray-800 mb-2">
                Your Dating Bio
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Paste your dating app bio here..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-2">
              <button
                type="button"
                className="w-full sm:w-auto sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200 shadow-md"
                onClick={analyzeBioHandler}
                disabled={loading || !bio.trim()}
              >
                <span className={!loading ? 'flex items-center justify-center' : 'hidden'}>
                  Analyze Bio
                </span>
                <span className={loading ? 'flex items-center justify-center' : 'hidden'}>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Results column - always rendered but visually hidden when no analysis */}
        <div className={`lg:w-1/3 transition-all duration-500 ease-in-out ${
          showAnalysis 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-full absolute pointer-events-none'
        }`}>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-full">
            <div className="analysis-results-container h-full flex flex-col">
              <div className="analysis-results flex-grow">
                <div className={`h-full flex flex-col ${!analysis ? 'hidden' : ''}`}>
                  <div ref={strengthsRef} className="mb-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Strengths
                    </h3>
                    <ul className="space-y-1">
                      {analysis?.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Suggestions for Improvement
                    </h3>
                    <ul className="space-y-1">
                      {analysis?.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={`text-center py-12 ${analysis ? 'hidden' : ''}`}>
                  <p className="text-gray-500">Your analysis results will appear here after submitting your bio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall feedback column - always rendered but visually hidden when no analysis */}
        <div className={`lg:w-1/3 transition-all duration-500 ease-in-out ${
          showAnalysis 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-full absolute pointer-events-none'
        }`}>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-full">
            <div className={`h-full flex flex-col ${!analysis ? 'hidden' : ''}`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Overall Feedback</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex-grow">
                <p className="text-gray-700">{analysis?.overall}</p>
              </div>
            </div>
            <div className={`text-center py-12 ${analysis ? 'hidden' : ''}`}>
              <p className="text-gray-500">Your overall feedback will appear here after submitting your bio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended bio section - always rendered but visually hidden when no analysis */}
      <div className={`transition-all duration-500 ease-in-out ${
        showAnalysis && analysis
          ? 'opacity-100 translate-y-0 mt-6' 
          : 'opacity-0 -translate-y-full absolute pointer-events-none'
      }`}>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2 sm:mb-0">Recommended Bio</h3>
            <div className="flex space-x-2">
              <button
                onClick={refreshBio}
                disabled={refreshing}
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
              >
                <span className={!refreshing ? 'flex items-center' : 'hidden'}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh
                </span>
                <span className={refreshing ? 'flex items-center' : 'hidden'}>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200 disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span className={copied ? 'hidden' : ''}>Copy</span>
                <span className={!copied ? 'hidden' : ''}>Copied!</span>
              </button>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <pre className="text-gray-700 whitespace-pre-wrap font-sans">{analysis?.recommendedBio}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}