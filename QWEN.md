# Project Context: Dating Bio Analyzer

## Project Overview
A web application that analyzes dating app bios using AI and provides feedback for improvement. The application allows users to paste their dating app bio, which is then analyzed by an AI to provide:
- A score out of 100 for their bio
- Personalized strengths and suggestions for improvement
- Overall feedback
- A recommended improved version of their bio

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenRouter API
- **Testing**: Playwright for end-to-end testing

## Project Structure
```
├── app/                    # Next.js app directory with pages
│   ├── test/              # Test page
│   ├── page.tsx           # Main page (home)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global CSS
├── components/            # React components
│   └── BioAnalyzer.tsx    # Main bio analyzer component
├── lib/                   # Utility functions
│   └── openrouter.ts      # OpenRouter API integration
├── tests/                 # Playwright tests
│   └── bioAnalyzer.spec.ts # E2E tests for bio analyzer
├── public/                # Static assets (if any)
└── ...
```

## Key Components

### BioAnalyzer Component (`components/BioAnalyzer.tsx`)
The main React component that provides the UI for the application:
- Text area for users to paste their dating bio
- Analyze button to trigger the AI analysis
- Results display showing:
  - Score with visual indicator
  - Strengths of the bio
  - Suggestions for improvement
  - Overall feedback
  - Recommended improved bio with copy functionality
- Scoring information panel that explains the evaluation criteria

### OpenRouter Integration (`lib/openrouter.ts`)
Handles communication with the OpenRouter API:
- `analyzeBio(bio: string)`: Main function that sends a bio to the AI for analysis
- Contains a strict scoring system with 4 categories (25 points each):
  1. Clarity & Purpose
  2. Engagement Factors
  3. Authenticity
  4. Presentation
- Implements a stringent scoring strategy where very low-effort bios (e.g., just "Hi") score below 30
- Implements fallback mock data when API key is not configured
- Uses `openrouter/sonoma-dusk-alpha` as the default model

## Environment Variables
- `OPENROUTER_API_KEY`: Required for AI analysis features
- `OPENROUTER_MODEL`: Optional, defaults to "openrouter/sonoma-dusk-alpha"

## Development Workflow

### Starting the Development Server
```bash
npm run dev
```
Starts the Next.js development server on http://localhost:3000

### Building for Production
```bash
npm run build
```
Creates an optimized production build

### Running Tests
```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui
```

### Linting
```bash
npm run lint
```

## Testing
The project uses Playwright for end-to-end testing with tests located in the `tests` directory. The main test file `bioAnalyzer.spec.ts` includes tests for:
- Basic bio analysis functionality
- Scoring information toggle
- Copy to clipboard feature

## Key Features
1. Responsive design that works on all devices
2. Real-time AI-powered analysis of dating bios with stringent scoring
3. Detailed scoring breakdown with visual indicators
4. Copy-to-clipboard functionality for recommended bios
5. Refresh feature to generate new variations of recommended bios
6. Edit and reanalyze functionality directly in the text box
7. Comprehensive explanation of scoring methodology
8. Graceful fallback to mock data when API is not configured

## Development Notes
- The application uses Next.js App Router for routing
- TypeScript is used for type safety throughout the project
- Tailwind CSS is used for styling with a component-based approach
- The AI analysis is powered by OpenRouter API with a detailed prompt engineering approach
- Playwright is configured to start the development server automatically when running tests

## Recent Changes and Fixes

### Fixed Hydration Issues in BioAnalyzer Component
Resolved React hydration errors that were occurring due to inconsistent DOM structure between server and client renders:
- Implemented consistent DOM structure by always rendering the same number of elements
- Used CSS classes (`hidden`) instead of conditional rendering to show/hide elements
- Made list rendering consistent by always rendering a fixed number of items
- Added proper hydration handling to ensure consistent client-side behavior

### Fixed Mock Data Issue - Now Calling Actual LLM
Resolved issue where the application was using mock data instead of calling the actual LLM:
- Fixed environment variable loading within the function scope
- Ensured proper checking for both API key and model before using mock data
- Added detailed logging to verify that the LLM is being called correctly
- Confirmed that the API returns realistic LLM-generated scores (30-85) instead of mock data scores (0, 25, 45)

### Verified Complete Application Flow
Confirmed that the complete application flow works correctly:
- Frontend loads without hydration errors
- API correctly calls the LLM and returns real analysis
- LLM returns realistic scores and personalized feedback
- End-to-end functionality works from user input to LLM-generated recommendations

The application is now working correctly with both issues resolved. Users can successfully get AI-powered feedback on their dating app bios through the complete flow, with the application correctly calling the LLM and returning personalized, meaningful analysis.