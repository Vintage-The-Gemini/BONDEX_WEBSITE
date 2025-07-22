// frontend/src/pages/admin/CategoryTest.jsx
import React, { useState } from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

const CategoryTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCategoriesAPI = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log("🧪 Testing categories API...");

      const response = await fetch("/api/categories", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        setTestResult({
          success: false,
          error: "Server returned HTML instead of JSON",
          details: text.substring(0, 500),
          status: response.status,
        });
        return;
      }

      const data = await response.json();

      setTestResult({
        success: response.ok,
        data: data,
        status: response.status,
        error: response.ok ? null : data.message,
      });
    } catch (error) {
      console.error("Test error:", error);
      setTestResult({
        success: false,
        error: error.message,
        details: "Network or parsing error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Categories API Test
        </h1>

        <div className="mb-6">
          <button
            onClick={testCategoriesAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Test Categories API
          </button>
        </div>

        {testResult && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <h3 className="font-semibold">
                {testResult.success ? "SUCCESS" : "FAILED"}
              </h3>
              <span className="text-sm text-gray-500">
                Status: {testResult.status}
              </span>
            </div>

            {testResult.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-700">{testResult.error}</p>
              </div>
            )}

            {testResult.details && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-gray-800 font-medium">Details:</p>
                <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                  {testResult.details}
                </pre>
              </div>
            )}

            {testResult.data && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-medium">Response Data:</p>
                <pre className="text-xs text-green-700 mt-1 whitespace-pre-wrap">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Quick Checks:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Backend server running on port 5000?</li>
            <li>• Database connected?</li>
            <li>• Category routes properly registered in server.js?</li>
            <li>• Category model exists?</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryTest;
