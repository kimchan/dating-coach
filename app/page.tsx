import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import BioAnalyzer with SSR disabled
const BioAnalyzer = dynamic(() => import('@/components/BioAnalyzer'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <Suspense fallback={<div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>}>
        <BioAnalyzer />
      </Suspense>
    </main>
  );
}