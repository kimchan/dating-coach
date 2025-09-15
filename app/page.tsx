import dynamic from 'next/dynamic';

// Dynamically import BioAnalyzer with SSR disabled to prevent hydration errors
const BioAnalyzer = dynamic(() => import('@/components/BioAnalyzer'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <BioAnalyzer />
    </main>
  );
}