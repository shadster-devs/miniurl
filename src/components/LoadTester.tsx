import { useState } from 'react';

interface LoadTestResult {
  total_requests: number;
  successful_tests: number;
  failed_tests: number;
  average_time_ms: number;
  min_response_time: number;
  max_response_time: number;
  total_time_seconds: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

export default function LoadTester() {
  const [concurrentRequests, setConcurrentRequests] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LoadTestResult | null>(null);

  const runLoadTest = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/loadtest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: concurrentRequests,
        }),
      });

      if (!response.ok) {
        throw new Error('Load test failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Load test error:', error);
      alert('Failed to run load test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Load Tester</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Requests
        </label>
        <input
          type="number"
          min="1"
          max="10000"
          value={concurrentRequests}
          onChange={(e) => setConcurrentRequests(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        onClick={runLoadTest}
        disabled={isLoading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }`}
      >
        {isLoading ? 'Running Test...' : 'Run Load Test'}
      </button>

      {result && (
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{result.total_requests}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {((result.successful_tests / result.total_requests) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Average Response Time</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{result.average_time_ms.toFixed(2)}ms</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Time</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{result.total_time_seconds.toFixed(2)}s</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Min Response Time</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{result.min_response_time}ms</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Max Response Time</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{result.max_response_time}ms</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 