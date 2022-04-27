import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { listDocuments, DocumentSummary } from '../../api';

export interface DocumentsState {
  documents: Array<DocumentSummary>;
  hasPrevious: boolean;
  hasNext: boolean;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: DocumentsState = {
  documents: [],
  hasPrevious: false,
  hasNext: false,
  status: 'idle',
};

const pageSize = 20;

export const listDocumentsAsync = createAsyncThunk(
  'documents/listDocuments',
  async (params: {
    isForward: boolean;
    previousID?: string;
  }): Promise<{
    documents: Array<DocumentSummary>;
    hasNext: boolean;
    hasPrevious: boolean;
  }> => {
    const { isForward, previousID = '' } = params;
    const documents = await listDocuments(previousID, pageSize + 1, isForward);

    return getPaginationData({ documents, isForward, previousID, pageSize });
  }
);

export const getPaginationData = (params: {
  documents: Array<DocumentSummary>;
  isForward: boolean;
  previousID: string;
  pageSize: number;
}): {
  documents: Array<DocumentSummary>;
  hasNext: boolean;
  hasPrevious: boolean;
} => {
  const { isForward, previousID, documents, pageSize } = params;
  const isFull = documents.length === pageSize + 1;

  return {
    documents: !isFull ? documents : isForward ? documents.slice(1, pageSize + 1) : documents.slice(0, pageSize),
    hasPrevious: !!previousID && (isFull || !isForward),
    hasNext: isFull || (!isFull && isForward),
  };
};

export const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listDocumentsAsync.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(listDocumentsAsync.fulfilled, (state, action) => {
      const { documents, hasPrevious, hasNext } = action.payload;
      state.status = 'idle';
      state.documents = documents;
      state.hasNext = hasNext;
      state.hasPrevious = hasPrevious;
    });
    builder.addCase(listDocumentsAsync.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export const selectDocuments = (state: RootState) => state.documents;

export default documentSlice.reducer;
