'use client';

import { useState } from 'react';
import URLShortenerForm from '@/components/URLShortenerForm';
import ShortenedURL from '@/components/ShortenedURL';
import LoadTester from '@/components/LoadTester';

interface ShortenedURLEntry {
  shortCode: string;
  originalUrl: string;
}

export default function Home() {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURLEntry[]>([]);
  const [showLoadTester, setShowLoadTester] = useState(false);

  const handleURLShortened = (shortCode: string, originalUrl: string) => {
    setShortenedUrls((prev) => [{
      shortCode,
      originalUrl,
    }, ...prev]);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MiniURL
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Shorten your URLs instantly with our high-performance service
          </p>
          <button
            onClick={() => setShowLoadTester(!showLoadTester)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showLoadTester ? 'Hide Load Tester' : 'Show Load Tester'}
          </button>
        </div>

        <div className="flex flex-col items-center gap-8">
          <URLShortenerForm onSuccess={handleURLShortened} />

          {showLoadTester && (
            <div className="w-full">
              <LoadTester />
            </div>
          )}

          {shortenedUrls.map((url) => (
            <ShortenedURL
              key={url.shortCode}
              shortCode={url.shortCode}
              originalUrl={url.originalUrl}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
