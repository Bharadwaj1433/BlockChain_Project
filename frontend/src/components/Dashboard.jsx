import { useEffect, useState } from "react";

const STORAGE_KEY = "proofledger_offline_records";

function readRecords() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [fingerprint, setFingerprint] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [record, setRecord] = useState(null);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  function loadHistory() {
    setHistoryLoading(true);
    try {
      const entries = readRecords().sort(
        (a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)
      );
      setHistory(entries);
      setRegisteredCount(entries.length);
    } catch {
      setMessage("Could not load local document history.");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const query = historySearch.trim().toLowerCase();
    return (
      !query ||
      item.fingerprint?.toLowerCase().includes(query) ||
      item.registeredBy?.toLowerCase().includes(query) ||
      item.registeredAt?.toLowerCase().includes(query)
    );
  });

  function exportHistoryToCSV() {
    if (history.length === 0) {
      setMessage("There is no document history to export.");
      return;
    }

    const headers = [
      "Fingerprint",
      "Document Name",
      "Registered By",
      "Registration Date",
      "Status",
    ];

    const rows = history.map((item) => [
      item.fingerprint,
      item.fileName,
      item.registeredBy,
      item.registeredAt,
      "Registered Locally",
    ]);

    const escapeCSV = (value) =>
      '"' + String(value ?? "").replace(/"/g, '""') + '"';

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "proofledger-document-history.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage("Document history exported successfully.");
  }

  async function handleFileChange(event) {
    const selected = event.target.files?.[0];
    setFile(selected || null);
    setFingerprint("");
    setMessage("");
    setRecord(null);

    if (!selected) return;

    try {
      const bytes = await selected.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const hash = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      setFingerprint(hash);
      setMessage("SHA-256 fingerprint generated successfully.");
    } catch {
      setMessage("Could not generate the fingerprint in this browser.");
    }
  }

  async function handleRegister() {
    if (!file || !fingerprint) {
      setMessage("Select a document first.");
      return;
    }

    setBusy(true);
    setRecord(null);

    try {
      const entries = readRecords();
      const existing = entries.find(
        (item) => item.fingerprint === fingerprint
      );

      if (existing) {
        setRecord({ ...existing, exists: true });
        setMessage("This document is already registered locally.");
        loadHistory();
        return;
      }

      const newRecord = {
        fingerprint,
        fileName: file.name,
        registeredBy: "Local User",
        registeredAt: new Date().toLocaleString(),
        exists: true,
      };

      entries.push(newRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      setRecord(newRecord);
      setMessage("Document registered successfully on this device.");
      loadHistory();
    } catch (error) {
      console.error(error);
      setMessage(
        "Could not save the record. Check whether browser storage is available."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    if (!fingerprint) {
      setMessage("Select a document first to verify its fingerprint.");
      return;
    }

    setBusy(true);
    setRecord(null);

    try {
      const entries = readRecords();
      const existing = entries.find(
        (item) => item.fingerprint === fingerprint
      );

      if (!existing) {
        setMessage(
          "NOT VERIFIED: this fingerprint is not registered on this device."
        );
        return;
      }

      setRecord({ ...existing, exists: true });
      setMessage(
        "VERIFIED: this fingerprint matches a locally registered document."
      );
    } catch (error) {
      console.error(error);
      setMessage("Verification failed because local storage could not be read.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <h2>ProofLedger</h2>
            <span>DOCUMENT INTEGRITY</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#overview" className="nav-item active">Dashboard</a>
          <a href="#register" className="nav-item">Register Document</a>
          <a href="#history" className="nav-item">Document History</a>
        </nav>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <h1>ProofLedger Dashboard</h1>
            <p>Calculate and verify document fingerprints locally.</p>
          </div>
        </header>

        <section id="overview" className="stats-grid">
          <article className="stat-card">
            <span>Total Registered Documents</span>
            <strong>{registeredCount}</strong>
          </article>
          <article className="stat-card">
            <span>Verification Method</span>
            <strong>SHA-256</strong>
          </article>
        </section>

        <section id="register" className="content-grid">
          <article className="panel">
            <div className="panel-heading">
              <h2>Register a Document</h2>
              <p>Choose a file to calculate its unique fingerprint.</p>
            </div>

            <label className="upload-area">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={busy}
              />
              <span className="upload-icon">↑</span>
              <strong>{file ? file.name : "Choose a document"}</strong>
              <span>
                {file
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : "Select a file from your device"}
              </span>
            </label>

            {fingerprint && (
              <div className="fingerprint-box">
                <strong>SHA-256 Fingerprint</strong>
                <code>{fingerprint}</code>
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard?.writeText(fingerprint);
                    setMessage("Fingerprint copied if clipboard access is available.");
                  }}
                >
                  Copy Fingerprint
                </button>
              </div>
            )}

            <div className="button-row">
              <button
                className="primary-button"
                onClick={handleRegister}
                disabled={busy || !fingerprint}
              >
                {busy ? "Processing..." : "Register Document"}
              </button>
              <button
                className="primary-button verify-button"
                onClick={handleVerify}
                disabled={busy || !fingerprint}
              >
                Verify Document
              </button>
            </div>

            {message && (
              <div className="message-box" role="status">{message}</div>
            )}

            {record && (
              <div className="record-details">
                <h3>Document Details</h3>
                <p><strong>File:</strong> {record.fileName || file?.name || "Previously registered file"}</p>
                <p><strong>Fingerprint:</strong> <code>{record.fingerprint || fingerprint}</code></p>
                <p><strong>Registered by:</strong> {record.registeredBy}</p>
                <p><strong>Registered at:</strong> {record.registeredAt}</p>
                <p><strong>Status:</strong> Verified locally</p>
              </div>
            )}
          </article>

          <article className="panel info-panel">
            <h2>How It Works</h2>
            <ol>
              <li><strong>Select a document.</strong> The browser reads its contents locally.</li>
              <li><strong>Generate a fingerprint.</strong> SHA-256 creates a fixed-length hash.</li>
              <li><strong>Register it.</strong> The fingerprint is saved in this browser.</li>
              <li><strong>Verify it later.</strong> Re-upload the document to compare fingerprints.</li>
            </ol>
            <div className="notice-box">
              Records are stored locally in this browser. Keep a backup of important documents.
            </div>
          </article>
        </section>

        <section id="history" className="panel history-panel">
          <div className="panel-heading history-heading">
            <div>
              <h2>Document History</h2>
              <p>Previously registered fingerprints on this device.</p>
            </div>
            <div className="history-actions">
              <button
                className="copy-button"
                onClick={loadHistory}
                disabled={historyLoading}
              >
                {historyLoading ? "Loading..." : "Refresh"}
              </button>
              <button
                className="primary-button"
                onClick={exportHistoryToCSV}
              >
                Export CSV
              </button>
            </div>
          </div>

          <input
            className="history-search"
            type="search"
            placeholder="Search fingerprint, user, or date..."
            value={historySearch}
            onChange={(event) => setHistorySearch(event.target.value)}
          />

          {filteredHistory.length === 0 ? (
            <div className="empty-state">
              {history.length === 0
                ? "No documents registered on this device yet."
                : "No records match your search."}
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Fingerprint</th>
                    <th>Registered At</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.fingerprint}>
                      <td>{item.fileName}</td>
                      <td>
                        <code className="hash-preview">
                          {item.fingerprint.slice(0, 18)}...
                        </code>
                      </td>
                      <td>{item.registeredAt}</td>
                      <td><span className="table-status">Registered locally</span></td>
                      <td>
                        <button
                          className="copy-button"
                          onClick={() => setSelectedHistoryItem(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedHistoryItem && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedHistoryItem(null)}
          >
            <section
              className="modal-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Document record details"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedHistoryItem(null)}
                aria-label="Close details"
              >
                ×
              </button>
              <h2>Document Record</h2>
              <p><strong>File:</strong> {selectedHistoryItem.fileName}</p>
              <p><strong>Fingerprint:</strong></p>
              <code>{selectedHistoryItem.fingerprint}</code>
              <p><strong>Registered by:</strong> {selectedHistoryItem.registeredBy}</p>
              <p><strong>Registered at:</strong> {selectedHistoryItem.registeredAt}</p>
              <p><strong>Status:</strong> Registered locally</p>
            </section>
          </div>
        )}

        <footer className="dashboard-footer">
          ProofLedger · Offline Document Integrity Checker
        </footer>
      </section>
    </main>
  );
}
