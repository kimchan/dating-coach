"use client";

import { useState, useEffect } from "react";

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
  const [mounted, setMounted] = useState(false);
  
  // Use effect to set mounted flag after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const analyzeBioHandler = async () => {
    if (!bio.trim() || !mounted) return;
    
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
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API response result:", result);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing bio:", error);
      // In a real implementation, you would have proper error handling here
      // For demonstration, we'll use mock data only in development
      if (process.env.NODE_ENV === 'development') {
        setAnalysis({
          score: 45,
          strengths: ["You took the time to write something"],
          improvements: [
            "Share specific details about your actual interests and experiences",
            "Include what you're genuinely looking for in a match",
            "Add a conversation starter to engage potential matches"
          ],
          overall: "Your bio needs more specific details about who you are and what you're looking for. Generic statements don't help potential matches get to know the real you.",
          recommendedBio: "Weekend warrior who once got lost for 6 hours but still made it back with an amazing sunset photo 📸\nLooking for someone who can laugh at my terrible sense of direction and enjoys spontaneous adventures.\n\nWhat's the weirdest thing you've seen on an adventure?"
        });
      } else {
        // In production, show an error message
        setAnalysis({
          score: 0,
          strengths: [],
          improvements: [
            "A completely empty bio won't attract any matches - you need to share something about yourself",
            "Include specific interests or hobbies to give people something to connect with",
            "Add a conversation starter question to encourage responses"
          ],
          overall: "An error occurred while analyzing your bio. Please try again later.",
          recommendedBio: "Weekend warrior who once got lost for 6 hours but still made it back with an amazing sunset photo 📸\nLooking for someone who can laugh at my terrible sense of direction and enjoys spontaneous adventures.\n\nWhat's the weirdest thing you've seen on an adventure?"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const refreshBio = async () => {
    if (!bio.trim() || !mounted) return;
    
    setRefreshing(true);
    
    try {
      console.log("Refreshing bio analysis");
      // For demo purposes, we'll use mock data only in development
      // In a real implementation, this would call a different API endpoint
      if (process.env.NODE_ENV === 'development') {
        setAnalysis({
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
          recommendedBio: "Curious explorer of both city hidden gems and good bookstores 📚\nBeliever that the best conversations happen over shared interests and genuine curiosity about others\nCurrently searching for someone who appreciates both planned adventures and spontaneous discoveries\n\nWhat's a skill or hobby you've always wanted to try but haven't yet?"
        });
      } else {
        // In production, call the actual LLM with a refresh prompt
        const refreshPrompt = `Create a refreshed version of the following dating app bio with the same characteristics but slightly different wording and structure:
        
Original bio: ${analysis?.recommendedBio || ""}
        
Instructions:
1. Maintain the same tone and personality
2. Keep the same core elements and interests
3. Change the wording and structure significantly
4. Make it sound authentic and not like a template
5. Keep it positive and inviting
6. Do not include any markdown or special formatting

Refreshed bio:`;
        
        const response = await fetch('/api/analyze-bio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            bio: analysis?.recommendedBio || "",
            customPrompt: refreshPrompt
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        setAnalysis(result);
      }
    } catch (error) {
      console.error("Error refreshing bio:", error);
      // In a real implementation, you would have proper error handling here
      // For demonstration, we'll use mock data only in development
      if (process.env.NODE_ENV === 'development') {
        setAnalysis({
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
          recommendedBio: "Curious explorer of both city hidden gems and good bookstores 📚\nBeliever that the best conversations happen over shared interests and genuine curiosity about others\nCurrently searching for someone who appreciates both planned adventures and spontaneous discoveries\n\nWhat's a skill or hobby you've always wanted to try but haven't yet?"
        });
      } else {
        // In production, keep the existing analysis if available
      }
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = () => {
    if (!analysis?.recommendedBio || !mounted) return;
    
    // Only run in browser environment
    if (typeof window !== 'undefined' && navigator.clipboard) {
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

  // Don't render anything until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header section - always visible */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Dating Bio Analyzer</h1>
            <button 
              className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 opacity-0 pointer-events-none"
              aria-label="How we score dating bios"
              disabled={true}
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
        
        {/* Scoring information - hidden by default */}
        <div className="mb-6 transition-all duration-300 ease-in-out overflow-hidden max-h-0 opacity-0">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-blue-800">How We Score Dating Bios</h3>
              <button 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium opacity-0 pointer-events-none"
                disabled={true}
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

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Input section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
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
                    value=""
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-2">
                <button
                  type="button"
                  className="w-full sm:w-auto sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200 shadow-md"
                  disabled={true}
                >
                  <span className="flex items-center justify-center">
                    Analyze Bio
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Results section - always rendered but hidden */}
          <div className="lg:w-1/3 hidden">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-full">
              <div className="h-full flex flex-col">
                <div className="mb-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Strengths
                  </h3>
                  <ul className="space-y-1">
                    <li className="flex items-start invisible">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Placeholder</span>
                    </li>
                    <li className="flex items-start invisible">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Placeholder</span>
                    </li>
                    <li className="flex items-start invisible">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Placeholder</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Suggestions for Improvement
                  </h3>
                  <ul className="space-y-1">
                    <li className="flex items-start invisible">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Placeholder</span>
                    </li>
                    <li className="flex items-start invisible">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Placeholder</span>
                    </li>
                    <li className="flex items-start invisible">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Placeholder</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Overall feedback section - always rendered but hidden */}
          <div className="lg:w-1/3 hidden">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Overall Feedback</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex-grow">
                  <p className="text-gray-700">Your feedback will appear here after analysis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommended bio section - always rendered but hidden */}
        <div className="hidden">
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2 sm:mb-0">Recommended Bio</h3>
                <div className="flex space-x-2">
                  <button
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                    disabled={true}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Refresh
                    </span>
                  </button>
                  <button
                    className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200 disabled:opacity-50"
                    disabled={true}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                  Your recommended bio will appear here after analysis.
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header section - always visible */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Dating Bio Analyzer</h1>
          <button 
            onClick={() => setShowScoringInfo(!showScoringInfo)}
            className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="How we score dating bios"
            disabled={!mounted}
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
        showScoringInfo && mounted
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-blue-800">How We Score Dating Bios</h3>
            <button 
              onClick={() => setShowScoringInfo(false)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={!mounted}
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

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
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
                  disabled={!mounted}
                />
              </div>
            </div>

            <div className="mb-2">
              <button
                type="button"
                className="w-full sm:w-auto sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200 shadow-md"
                onClick={analyzeBioHandler}
                disabled={loading || !bio.trim() || !mounted}
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

        {/* Results section - always rendered but conditionally visible */}
        <div className={`lg:w-1/3 ${(!analysis || !mounted) ? 'hidden' : ''}`}>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-full">
            <div className="h-full flex flex-col">
              <div className="mb-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Strengths
                </h3>
                <ul className="space-y-1">
                  {/* Always render list items but conditionally show content */}
                  {analysis?.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start invisible">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Placeholder</span>
                      </li>
                      <li className="flex items-start invisible">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Placeholder</span>
                      </li>
                      <li className="flex items-start invisible">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Placeholder</span>
                      </li>
                    </>
                  )}
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
                  )) || (
                    <>
                      <li className="flex items-start invisible">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Placeholder</span>
                      </li>
                      <li className="flex items-start invisible">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Placeholder</span>
                      </li>
                      <li className="flex items-start invisible">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Placeholder</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overall feedback section - always rendered but conditionally visible */}
        <div className={`lg:w-1/3 ${(!analysis || !mounted) ? 'hidden' : ''}`}>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-full">
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Overall Feedback</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex-grow">
                <p className="text-gray-700">{analysis?.overall || "Your feedback will appear here after analysis."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended bio section - always rendered but conditionally visible */}
      <div className={`${(!analysis || !mounted) ? 'hidden' : ''}`}>
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2 sm:mb-0">Recommended Bio</h3>
              <div className="flex space-x-2">
                <button
                  onClick={refreshBio}
                  disabled={refreshing || !mounted}
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
                  disabled={!mounted}
                  className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <span className={copied ? 'hidden' : ''}>Copy</span>
                  <span className={!copied ? 'hidden' : ''}>Copied!</span>
                </button>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                {analysis?.recommendedBio || "Your recommended bio will appear here after analysis."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}