// frontend/src/components/admin/QuickTest.jsx
import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const QuickTest = () => {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const tests = [
    { name: 'Health Check', url: '/api/health' },
    { name: 'Test Endpoint', url: '/api/test' },
    { name: 'Categories Debug', url: '/api/categories-debug' },
    { name: 'Categories', url: '/api/categories' }
  ];

  const runTest = async (test) => {
    setResults(prev => ({ ...prev, [test.name]: 'loading' }));
    
    try {
      const response = await fetch(test.url);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [test.name]: {
          success: response.ok,
          status: response.status,
          data: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [test.name]: {
          success: false,
          error: error.message
        }
      }));
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    for (const test of tests) {
      await runTest(test);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }
    setTesting(false);
  };

  const getIcon = (result) => {
    if (result === 'loading') return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
    if (!result) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    if (result.success) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">API Connection Test</h3>
        <button
          onClick={runAllTests}
          disabled={testing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Run Tests
        </button>
      </div>

      <div className="space-y-3">
        {tests.map((test) => {
          const result = results[test.name];
          return (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getIcon(result)}
                <span className="font-medium">{test.name}</span>
                <span className="text-sm text-gray-500">{test.url}</span>
              </div>
              
              {result && result !== 'loading' && (
                <div className="text-right text-sm">
                  {result.success ? (
                    <span className="text-green-600">✓ Status {result.status}</span>
                  ) : (
                    <span className="text-red-600">✗ {result.error || `Status ${result.status}`}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {results.Categories && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Categories Result:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(results.Categories.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default QuickTest;