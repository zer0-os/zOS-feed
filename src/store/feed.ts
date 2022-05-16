import {
  createSlice,
  createAction,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Model as FeedItem } from '../feed-item';

export enum SagaActionTypes {
  Load = 'feed/saga/load',
}

const load = createAction<ZnsRouteRequest>(SagaActionTypes.Load);

export interface ZnsRouteRequest {
  route: string;
  provider: any;
}

export enum AsyncActionStatus {
  Idle = 'idle',
  Loading = 'loading',
  Failed = 'failed',
}

// change this to root asyncData<T> state or something.
export interface FeedState {
  value: FeedItem[];
  selectedItem: FeedItem;
  status: AsyncActionStatus;
}

const initialState: FeedState = {
  value: [],
  selectedItem: null,
  status: AsyncActionStatus.Idle,
};

const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    receive: (state, action: PayloadAction<FeedItem[]>) => {
      state.value = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<FeedItem>) => {
      state.selectedItem = action.payload;
    },
  },
});

export const { receive, setSelectedItem } = slice.actions;
export const { reducer } =  slice;

export { load };
