import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchStandups, 
  editStandup, 
  removeStandup, 
  selectAllStandups, 
  selectStandupLoading,
  selectStandupError
} from '../store/standupSlice';
import {
  History, Search, Trash2, Edit2, CheckCircle2, XCircle,
  AlarmClock, ChevronLeft, ChevronRight, AlertTriangle, Save, X
} from 'lucide-react';

const PAGE_SIZE = 8;

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[4px] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onCancel}>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[18px] p-9 max-w-[380px] w-full text-center shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="w-[56px] h-[56px] rounded-[14px] bg-[rgba(239,68,68,0.12)] text-[var(--danger)] flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-[19px] font-bold text-[var(--text-primary)] mb-2">Delete Standup?</h3>
        <p className="text-[14px] text-[var(--text-secondary)] mb-6">This action cannot be undone. The entry will be permanently removed.</p>
        <div className="flex gap-3 justify-center">
          <button className="flex-1 py-3 px-6 rounded-[10px] text-[15px] font-semibold bg-transparent text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all" onClick={onCancel}>Cancel</button>
          <button className="flex-1 py-3 px-6 rounded-[10px] text-[15px] font-bold bg-[var(--danger)] text-white hover:opacity-85 transition-all" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ entry, onConfirm, onCancel }) {
  const [form, setForm] = useState({
    rawUpdate: entry.rawUpdate || '',
    formattedStandup: entry.formattedStandup || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onConfirm(entry.id, form);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[4px] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onCancel}>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 max-w-[600px] w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Edit2 size={20} className="text-[var(--accent)]" />
            <h3 className="text-[20px] font-bold text-[var(--text-primary)]">Edit Standup</h3>
          </div>
          <button onClick={onCancel} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">Raw Update</label>
            <textarea
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border-[1.5px] border-[var(--border)] rounded-[10px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] transition-all min-h-[100px] text-[14px] resize-none"
              value={form.rawUpdate}
              onChange={e => setForm({ ...form, rawUpdate: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">Formatted Standup</label>
            <textarea
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border-[1.5px] border-[var(--border)] rounded-[10px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] transition-all min-h-[180px] text-[14px] resize-none"
              value={form.formattedStandup}
              onChange={e => setForm({ ...form, formattedStandup: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="flex-1 py-3 rounded-[10px] font-semibold text-[15px] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-all" onClick={onCancel}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-[10px] font-bold text-[15px] bg-gradient-main text-white shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EntryCard({ entry, onEdit, onDelete }) {
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-[20px_24px] hover:border-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent-glow)] transition-all animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3.5 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">{entry.developerName}</span>
          <span className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
            <AlarmClock size={12} /> {formattedDate} · {formattedTime}
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 justify-end">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
            entry.telegramSent 
              ? 'bg-[rgba(16,185,129,0.15)] text-[var(--success)]' 
              : 'bg-[rgba(239,68,68,0.15)] text-[var(--danger)]'
          }`}>
            {entry.telegramSent ? <><CheckCircle2 size={11} /> Sent</> : <><XCircle size={11} /> Failed</>}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center bg-transparent border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
            onClick={() => onEdit(entry)}
            title="Edit entry"
          >
            <Edit2 size={15} />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center bg-transparent border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:border-[var(--danger)] hover:text-[var(--danger)] transition-all"
            onClick={() => onDelete(entry.id)}
            title="Delete entry"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {entry.rawUpdate && (
        <div className="mt-3">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text-muted)] mb-1.5">Raw Update</span>
          <p className="text-[13px] text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-[10px_14px] italic leading-[1.5]">
            {entry.rawUpdate}
          </p>
        </div>
      )}

      <div className="mt-3">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text-muted)] mb-1.5">Formatted</span>
        <p className="text-[14px] text-[var(--text-primary)] leading-[1.6] whitespace-pre-wrap">
          {entry.formattedStandup}
        </p>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const dispatch = useDispatch();
  const allEntries = useSelector(selectAllStandups);
  const loading = useSelector(selectStandupLoading);
  const standupError = useSelector(selectStandupError);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [editEntry, setEditEntry] = useState(null);

  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);

  const filtered = allEntries.filter(e =>
    e.formattedStandup?.toLowerCase().includes(search.toLowerCase()) ||
    e.rawUpdate?.toLowerCase().includes(search.toLowerCase()) ||
    e.developerName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    try {
      await dispatch(removeStandup(deleteId)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await dispatch(editStandup({ id, data })).unwrap();
      setEditEntry(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-[24px] pt-3 pb-12">
      {deleteId && <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      {editEntry && <EditModal entry={editEntry} onConfirm={handleUpdate} onCancel={() => setEditEntry(null)} />}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1 relative">
            <History size={22} className="text-[var(--accent)]" />
            <h1 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">Standup History</h1>
          </div>
          <p className="text-[14px] text-[var(--text-secondary)]">{allEntries.length} total entries</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-[280px]">
          <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border-[1.5px] border-[var(--border)] rounded-[10px] text-[var(--text-primary)] text-[14px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-[var(--text-muted)]"
            placeholder="Search standups..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {standupError && <div className="p-3.5 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-[10px] text-[var(--danger)] text-[14px] font-medium animate-in fade-in">{standupError}</div>}

      {/* Content */}
      <div className="min-h-[400px]">
        {loading && allEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3.5 text-[var(--text-muted)]">
            <div className="w-8 h-8 border-[3px] border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[15px]">Loading your standups...</span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3.5 text-[var(--text-muted)] text-center">
            <History size={48} className="opacity-20" />
            <p className="text-[15px]">{search ? 'No results match your search.' : 'No standups yet. Submit your first one from the dashboard!'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {paginated.map(entry => (
              <EntryCard key={entry.id} entry={entry} onEdit={setEditEntry} onDelete={setDeleteId} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-2 mb-4">
          <button
            className="flex items-center gap-2 py-2.5 px-4 rounded-[10px] bg-transparent text-[var(--text-secondary)] border-[1.5px] border-[var(--border)] font-semibold text-[14px] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:pointer-events-none transition-all"
            onClick={() => {
               setPage(p => Math.max(1, p - 1));
               window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-[14px] text-[var(--text-secondary)] font-medium">Page {page} of {totalPages}</span>
          <button
            className="flex items-center gap-2 py-2.5 px-4 rounded-[10px] bg-transparent text-[var(--text-secondary)] border-[1.5px] border-[var(--border)] font-semibold text-[14px] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:pointer-events-none transition-all"
            onClick={() => {
               setPage(p => Math.min(totalPages, p + 1));
               window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
