import { DocumentSummary } from '../../api/types';
import reducer, { listDocumentsAsync, DocumentsState } from './documentsSlice';

const PAGE_SIZE = 5;
const TOTAL_SIZE = 15;
const sampleDocumentData: Array<DocumentSummary> = [];
for (let i = 0; i < TOTAL_SIZE; i++) {
  sampleDocumentData.push({
    id: `${i}`,
    key: { collection: `col${i}`, document: `doc${i}` },
    snapshot: '',
  });
}
const initialState: DocumentsState = {
  documents: [],
  hasPrevious: false,
  hasNext: false,
  status: 'idle',
};

describe('Pagination', () => {
  describe('single page', () => {
    it('Previous and next buttons should be disabled', () => {
      const documents = sampleDocumentData.slice(10, 15).reverse();
      const action = {
        type: listDocumentsAsync.fulfilled.type,
        payload: {
          documents,
          isForward: false,
          previousID: '',
          pageSize: PAGE_SIZE,
        },
      };
      const state = reducer(initialState, action);
      expect(state.hasPrevious).toEqual(false);
      expect(state.hasNext).toEqual(false);
      expect(state.documents.map((document) => document.id)).toEqual(['14', '13', '12', '11', '10']);
    });
  });

  describe('multiple pages', () => {
    it('Previous button should be disabled on initial page', () => {
      const documents = sampleDocumentData.slice(9, 15).reverse();
      const action = {
        type: listDocumentsAsync.fulfilled.type,
        payload: {
          documents,
          isForward: false,
          previousID: '',
          pageSize: PAGE_SIZE,
        },
      };
      const state = reducer(initialState, action);
      expect(state.hasPrevious).toEqual(false);
      expect(state.hasNext).toEqual(true);
      expect(state.documents.map((document) => document.id)).toEqual(['14', '13', '12', '11', '10']);
    });

    it('Previous button should be disabled when moving to first page', () => {
      const documents = sampleDocumentData.slice(10, 15).reverse();
      const action = {
        type: listDocumentsAsync.fulfilled.type,
        payload: {
          documents,
          isForward: true,
          previousID: '9',
          pageSize: PAGE_SIZE,
        },
      };
      const state = reducer(initialState, action);
      expect(state.hasPrevious).toEqual(false);
      expect(state.hasNext).toEqual(true);
      expect(state.documents.map((document) => document.id)).toEqual(['14', '13', '12', '11', '10']);
    });

    it('Next button should be disabled when moving to last page', () => {
      const documents = sampleDocumentData.slice(0, 5).reverse();
      const action = {
        type: listDocumentsAsync.fulfilled.type,
        payload: {
          documents,
          isForward: false,
          previousID: '5',
          pageSize: PAGE_SIZE,
        },
      };
      const state = reducer(initialState, action);
      expect(state.hasPrevious).toEqual(true);
      expect(state.hasNext).toEqual(false);
      expect(state.documents.map((document) => document.id)).toEqual(['4', '3', '2', '1', '0']);
    });

    it('Previous and next buttons should be abled when moving to next page', () => {
      const documents = sampleDocumentData.slice(4, 10).reverse();
      const action = {
        type: listDocumentsAsync.fulfilled.type,
        payload: {
          documents,
          isForward: false,
          previousID: '10',
          pageSize: PAGE_SIZE,
        },
      };
      const state = reducer(initialState, action);
      expect(state.hasPrevious).toEqual(true);
      expect(state.hasNext).toEqual(true);
      expect(state.documents.map((document) => document.id)).toEqual(['9', '8', '7', '6', '5']);
    });

    it('Previous and next buttons should be abled when moving to previous page', () => {
      const documents = sampleDocumentData.slice(5, 11).reverse();
      const action = {
        type: listDocumentsAsync.fulfilled.type,
        payload: {
          documents,
          isForward: true,
          previousID: '4',
          pageSize: PAGE_SIZE,
        },
      };
      const state = reducer(initialState, action);
      expect(state.hasPrevious).toEqual(true);
      expect(state.hasNext).toEqual(true);
      expect(state.documents.map((document) => document.id)).toEqual(['9', '8', '7', '6', '5']);
    });
  });
});
