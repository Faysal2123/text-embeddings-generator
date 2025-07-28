import React, { useState } from "react";

function App() {
  const [embeddings, setEmbeddings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmbeddings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/embeddings");
      if (!res.ok) throw new Error("Failed to fetch embeddings");
      const data = await res.json();
      setEmbeddings(data.embeddings);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Paragraph Embeddings (Hugging Face)
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={fetchEmbeddings}
          disabled={loading}
          className={`px-6 py-3 rounded-md text-white font-semibold transition 
            ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Loading..." : "Generate Embeddings"}
        </button>
      </div>

      {error && (
        <p className="text-center text-red-600 font-medium mb-6">{error}</p>
      )}

      <div>
        {embeddings.length === 0 && (
          <p className="text-center text-gray-500">No embeddings loaded.</p>
        )}

        {embeddings.map(({ paragraph, embedding }, i) => (
          <div
            key={i}
            className="mb-6 p-5 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Paragraph {i + 1}:
            </h2>
            <p className="text-gray-700 mb-3">{paragraph}</p>
            <p className="text-sm text-gray-500 mb-2">
              Embedding vector length:{" "}
              <span className="font-mono">{embedding.length}</span>
            </p>
            <pre
              className="bg-gray-100 rounded-md p-3 text-xs overflow-auto max-h-24 font-mono"
              title="First 10 values of embedding"
            >
              {JSON.stringify(embedding.slice(0, 10))} ...
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
