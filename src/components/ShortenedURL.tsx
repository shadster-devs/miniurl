'use client';

import { useState, useEffect } from 'react';
import { getURLStats, getShortURL, URLEntry } from '@/lib/api';

interface ShortenedURLProps {
  shortCode: string;
  originalUrl: string;
}

export default function ShortenedURL({ shortCode, originalUrl }: ShortenedURLProps) {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<URLEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const shortUrl = getShortURL(shortCode);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const urlStats = await getURLStats(shortCode);
        setStats(urlStats);
      } catch (error) {
        console.error('Failed to load URL stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [shortCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Original URL</label>
          <p className="text-gray-800 truncate">{originalUrl}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Shortened URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 rounded border border-gray-200"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading statistics...</div>
        ) : stats && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-lg font-semibold">
                {new Date(stats.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Visits</p>
              <p className="text-lg font-semibold">{stats.visits}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 