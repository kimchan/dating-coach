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
- Uses `deepseek/deepseek-chat-v3.1:free` as the default model

## Environment Variables
- `OPENROUTER_API_KEY`: Required for AI analysis features
- `OPENROUTER_MODEL`: Optional, defaults to "deepseek/deepseek-chat-v3.1:free"

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

## Qwen Added Memories
- Fixed hydration error in BioAnalyzer component by ensuring consistent DOM structure between server and client renders. Wrapped conditional content in a consistent container structure and used CSS classes to control visibility instead of conditional rendering.
- Updated UI layout with several improvements:
1. Removed "Analysis Results" and "Your Bio Score" text and score circle display
2. Moved overall feedback to its own third column (1/3 width) on the right
3. Moved recommended bio to a new row at the bottom underneath the 3 columns
4. Adjusted column heights to fit content naturally without artificial stretching
5. Shortened the "Your Dating Bio" text box to 6 rows (matching other columns)
6. Removed icons and color coding from section titles while keeping them in list items
7. Reduced width of "How We Score Dating Bios" section with max-w-3xl
8. Information icon moved inline with the title
9. Initial text box made smaller to reduce scrolling
- Updated UI layout with several improvements:
1. Removed "Analysis Results" and "Your Bio Score" text and score circle display
2. Moved overall feedback to its own third column (1/3 width) on the right
3. Moved recommended bio to a new row at the bottom underneath the 3 columns
4. Adjusted column heights to fit content naturally without artificial stretching
5. Shortened the "Your Dating Bio" text box to 6 rows (matching other columns)
6. Removed icons and color coding from section titles while keeping them in list items
7. Reduced width of "How We Score Dating Bios" section with max-w-3xl
8. Information icon moved inline with the title
9. Initial text box made smaller to reduce scrolling
- Implemented animated progress ring with gamified elements for displaying dating bio scores:
1. Created ScoreRing component with animated circular progress indicator
2. Added gamified avatars/emojis that change based on score ranges:
   - 90-100: 👑 Dating Guru
   - 75-89: 🌟 Charm Master
   - 60-74: 👍 Social Butterfly
   - 45-59: 🤔 Work in Progress
   - 30-44: 🐣 Newbie
   - 0-29: 🥚 Just Starting
3. Added descriptive labels and encouraging messages for each score range
4. Integrated with overall feedback section in the three-column layout
5. Created test page at /test-score-ring to demonstrate different score ranges
6. Added smooth animations and transitions for delightful user experience
- Removed the animated progress ring with gamified elements feature. Reverted to the previous implementation which focuses on the core functionality of analyzing dating bios and providing feedback without additional gamification elements. The application maintains its clean, professional appearance while still providing all the essential features for improving dating profiles.
