import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { standupApi } from '../api/services';

// Thunks
export const fetchStandups = createAsyncThunk(
  'standup/fetchAll',
  async (force = false, { getState, rejectWithValue }) => {
    const { standup } = getState();
    const now = Date.now();
    
    // Caching: If fetched less than 1 minute ago and not forced, skip
    if (!force && standup.lastFetched && (now - standup.lastFetched < 60000)) {
      return standup.entries;
    }

    try {
      const res = await standupApi.getHistory();
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch standups');
    }
  }
);

export const submitStandup = createAsyncThunk(
  'standup/submit',
  async (data, { rejectWithValue }) => {
    try {
      const res = await standupApi.submit(data);
      // Backend returns the new entry (sometimes in res.data.data)
      return res.data?.data || res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit standup');
    }
  }
);

export const editStandup = createAsyncThunk(
  'standup/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await standupApi.update(id, data);
      return res.data?.data || res.data || { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update standup');
    }
  }
);

export const removeStandup = createAsyncThunk(
  'standup/remove',
  async (id, { rejectWithValue }) => {
    try {
      await standupApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete standup');
    }
  }
);

const standupSlice = createSlice({
  name: 'standup',
  initialState: {
    entries: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearStandupError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchStandups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStandups.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchStandups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit
      .addCase(submitStandup.fulfilled, (state, action) => {
        // Prepend the new entry to keep desc order
        if (action.payload && typeof action.payload === 'object') {
          state.entries = [action.payload, ...state.entries];
        }
      })
      // Edit
      .addCase(editStandup.fulfilled, (state, action) => {
        const updated = action.payload;
        state.entries = state.entries.map(e => e.id === updated.id ? { ...e, ...updated } : e);
      })
      // Remove
      .addCase(removeStandup.fulfilled, (state, action) => {
        state.entries = state.entries.filter(e => e.id !== action.payload);
      });
  },
});

export const { clearStandupError } = standupSlice.actions;

export const selectAllStandups = (state) => state.standup.entries;
export const selectStandupLoading = (state) => state.standup.loading;
export const selectStandupError = (state) => state.standup.error;

export default standupSlice.reducer;
