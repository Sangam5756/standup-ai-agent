import React, { useState, useEffect, useCallback } from 'react';
import { standupApi } from '../api/services';
import {
  History, Search, Trash2, CheckCircle2, XCircle,
  AlarmClock, ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import './HistoryPage.css';

const PAGE_SIZE = 8;

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-icon"><AlertTriangle size={28} /></div>
        <h3>Delete Standup?</h3>
        <p>This action cannot be undone. The entry will be permanently removed.</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

function EntryCard({ entry, onDelete }) {
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="entry-card fade-in">
      <div className="entry-card-header">
        <div className="entry-meta">
          <span className="entry-dev">{entry.developerName}</span>
          <span className="entry-datetime">
            <AlarmClock size={12} /> {formattedDate} · {formattedTime}
          </span>
        </div>
        <div className="entry-actions">
          <span className={`badge ${entry.telegramSent ? 'badge-success' : 'badge-danger'}`}>
            {entry.telegramSent ? <><CheckCircle2 size={11} /> Sent</> : <><XCircle size={11} /> Failed</>}
          </span>
          <button
            className="entry-delete-btn"
            onClick={() => onDelete(entry.id)}
            title="Delete entry"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {entry.rawUpdate && (
        <div className="entry-section">
          <span className="entry-section-label">Raw Update</span>
          <p className="entry-raw">{entry.rawUpdate}</p>
        </div>
      )}

      <div className="entry-section">
        <span className="entry-section-label">Formatted</span>
        <p className="entry-formatted">{entry.formattedStandup}</p>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await standupApi.getHistory();
      // HistoryController returns ResponseEntity<List<StandupEntry>> directly
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setAllEntries(data);
    } catch (err) {
      const msg = err.response?.status === 401
        ? 'Session expired. Please log in again.'
        : 'Failed to load history. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // Client-side search filter
  const filtered = allEntries.filter(e =>
    e.formattedStandup?.toLowerCase().includes(search.toLowerCase()) ||
    e.rawUpdate?.toLowerCase().includes(search.toLowerCase()) ||
    e.developerName?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    try {
      await standupApi.delete(deleteId);
      setAllEntries(prev => prev.filter(e => e.id !== deleteId));
    } catch {
      setError('Failed to delete entry.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="history-page container">
      {deleteId && <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}

      {/* Header */}
      <div className="history-header fade-in">
        <div>
          <div className="history-title-row">
            <History size={22} className="title-icon" />
            <h1>Standup History</h1>
          </div>
          <p>{allEntries.length} total entries</p>
        </div>

        {/* Search */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search standups..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error fade-in">{error}</div>}

      {/* Content */}
      {loading ? (
        <div className="history-state">
          <div className="spinner" style={{ borderTopColor: 'var(--accent)', width: 32, height: 32 }} />
          <span>Loading your standups...</span>
        </div>
      ) : paginated.length === 0 ? (
        <div className="history-state fade-in">
          <History size={48} />
          <p>{search ? 'No results match your search.' : 'No standups yet. Submit your first one from the dashboard!'}</p>
        </div>
      ) : (
        <div className="entries-list fade-in">
          {paginated.map(entry => (
            <EntryCard key={entry.id} entry={entry} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination fade-in">
          <button
            className="btn btn-secondary pagination-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button
            className="btn btn-secondary pagination-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
