# Dating Bio Analyzer

A web application that analyzes dating app bios using AI and provides feedback for improvement.

## Features

- Paste your dating app bio to get AI-powered analysis
- Receive a score out of 100 for your bio (with very low-effort bios scoring below 30)
- Get personalized strengths and suggestions for improvement
- Copy recommended bios to clipboard with one click
- Refresh to generate new variations of recommended bios
- Edit and reanalyze your bio directly in the text box
- Responsive design that works on all devices
- Fixed hydration error by ensuring consistent DOM structure between server and client renders

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- OpenRouter API for AI analysis
- Playwright for end-to-end testing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

This project uses Playwright for end-to-end testing. Tests are located in the `tests` directory.

To run the tests:
```bash
npm test
```

To run the tests in UI mode:
```bash
npm run test:ui
```

## Deployment

To build the application for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Environment Variables

To use the OpenRouter API, you need to set the following environment variable:

- `OPENROUTER_API_KEY` - Your OpenRouter API key

Create a `.env.local` file in the root directory and add your API key:
```
OPENROUTER_API_KEY=your_api_key_here
```

## How It Works

1. Users paste their dating app bio into the text area
2. The application sends the bio to the OpenRouter API
3. The AI analyzes the bio using a stringent scoring system and provides:
   - A score out of 100 (with very low-effort bios scoring below 30)
   - Strengths of the bio
   - Suggestions for improvement
   - Overall feedback
4. Results are displayed in a user-friendly format

## Development

The application uses:
- Next.js App Router for routing
- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture
- Playwright for end-to-end testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.