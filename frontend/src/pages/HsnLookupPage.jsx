import { useCallback, useEffect, useRef, useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, isAbortError } from "../lib/api";

export default function HsnLookupPage() {
  usePageTitle("HSN Lookup");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounce = useRef(null);

  const search = useCallback((q) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    api.searchHsn(q, { signal: ctrl.signal })
      .then((res) => setResults(res?.items ?? res ?? []))
      .catch((err) => { if (!isAbortError(err)) setError(err.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => search(query), 300);
    return () => clearTimeout(debounce.current);
  }, [query, search]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">HSN Code Lookup</h1>
        <p className="text-sm text-ink-soft mt-1">Search for HSN codes by description or code number</p>
      </div>

      <div className="max-w-xl mb-6">
        <input
          type="search"
          placeholder="Search HSN codes... e.g. cement, 2523, steel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field text-base"
          autoFocus
        />
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {loading && (
        <div className="flex items-center gap-2 text-ink-soft text-sm mb-4">
          <span className="spinner" /> Searching...
        </div>
      )}

      {results.length > 0 && (
        <div className="panel p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>HSN Code</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="text-right">GST Rate</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.code}>
                    <td className="font-mono font-semibold text-brand">{item.code}</td>
                    <td className="max-w-md">{item.description}</td>
                    <td className="text-ink-soft text-sm">{item.category || "—"}</td>
                    <td className="text-right font-semibold tabular-nums">{item.gst_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="panel text-center py-12">
          <p className="text-ink-soft">No HSN codes found for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {query.length < 2 && !loading && (
        <div className="panel text-center py-12">
          <div className="text-3xl mb-3 opacity-40">&#x1F50D;</div>
          <p className="text-ink-soft mb-1">Type at least 2 characters to search</p>
          <p className="text-xs text-ink-muted">You can search by HSN code number or item description</p>
        </div>
      )}
    </div>
  );
}
