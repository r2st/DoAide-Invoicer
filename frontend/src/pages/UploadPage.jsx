import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { usePageTitle } from "../hooks/usePageTitle";
import { api } from "../lib/api";

const ACCEPT = ".jpg,.jpeg,.png,.pdf";

export default function UploadPage() {
  usePageTitle("Upload Invoices");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback((fileList) => {
    const valid = Array.from(fileList).filter((f) =>
      /\.(jpe?g|png|pdf)$/i.test(f.name)
    );
    setFiles(valid);
    setResults(null);
    setError("");
  }, []);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  async function upload() {
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const res = await api.uploadInvoices(files);
      setResults(res?.items ?? res ?? []);
      setFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Upload Invoices</h1>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <div
        className={`dropzone ${dragging ? "is-dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <svg className="w-12 h-12 mx-auto text-ink-muted mb-3" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20L28 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M28 8v12h12M24 28v-8M20 24l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-ink-soft mb-1">Drag and drop invoice images here</p>
          <p className="text-xs text-ink-muted">JPG, PNG, or PDF (multi-page supported)</p>
        </div>
        <label className="btn btn-ghost text-sm cursor-pointer">
          Choose files
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="visually-hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="panel">
          <h2 className="text-sm font-semibold mb-3">{files.length} file{files.length > 1 ? "s" : ""} selected</h2>
          <ul className="space-y-2 mb-4">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-line last:border-0">
                <span className="text-ink-soft">{i + 1}.</span>
                <span className="font-medium truncate flex-1">{f.name}</span>
                <span className="text-ink-muted text-xs">{(f.size / 1024).toFixed(0)} KB</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button type="button" className="btn btn-primary text-sm" onClick={upload} disabled={uploading}>
              {uploading ? "Uploading…" : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
            </button>
            <button type="button" className="btn btn-ghost text-sm" onClick={() => setFiles([])}>
              Clear
            </button>
          </div>
        </div>
      )}

      {results && (
        <div className="panel">
          <h2 className="text-sm font-semibold mb-3">Upload Results</h2>
          <ul className="space-y-2">
            {(Array.isArray(results) ? results : [results]).map((r, i) => (
              <li key={i} className={`flex items-center gap-3 text-sm py-2 px-3 rounded-[var(--radius)] border-l-[3px] ${
                r.status === "accepted" || r.id ? "border-l-good bg-good-bg" : "border-l-bad bg-bad-bg"
              }`}>
                <span className="flex-1 font-medium">{r.filename || r.vendor_name || `Invoice ${i + 1}`}</span>
                {r.id ? (
                  <Link to={`/invoices/${r.id}`} className="text-brand text-xs hover:text-brand-dark">View &rarr;</Link>
                ) : (
                  <span className="text-xs text-bad">{r.error || "Failed"}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
