import React from 'react';

const TestStyles = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
      <p className="text-lg text-gray-700">If you can see this styled correctly, Tailwind is working.</p>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
        <p className="text-gray-600">This should have a white background with a shadow.</p>
      </div>
    </div>
  );
};

export default TestStyles;