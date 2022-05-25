import {
  createSlice,
  createAction,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Model as FeedItem } from '../feed-model';

export enum SagaActionTypes {
  Load = 'feed/saga/load',
  SetItem = 'feed/saga/setItem',
}

const load = createAction<ZnsRouteRequest>(SagaActionTypes.Load);
const setSelectedItem = createAction<ZnsRouteRequest>(SagaActionTypes.SetItem);

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
  selectedItem?: FeedItem;
  status: AsyncActionStatus;
}

const initialState: FeedState = {
  value: [],
  selectedItem: undefined,
  status: AsyncActionStatus.Idle,
};

const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    receive: (state, action: PayloadAction<FeedItem[]>) => {
      state.value = action.payload;
    },
    select: (state, action: PayloadAction<FeedItem>) => {
      state.selectedItem = action.payload;
    },
  },
});

export const { receive, select } = slice.actions;
export const { reducer } =  slice;

export { load, setSelectedItem };
