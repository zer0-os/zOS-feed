import {
  createSlice,
  createAction,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Model as FeedItem } from '../feed-model';

export enum SagaActionTypes {
  Load = 'feed/saga/load',
  LoadItemMetadata = 'feed/saga/loadItemMetadata',
  SetItemByRoute = 'feed/saga/setItemByRoute',
  LoadSelectedItemMetadata = 'feed/saga/loadSelectedItemMetadata',
}

const load = createAction<ZnsRouteRequest>(SagaActionTypes.Load);
const loadItemMetadata = createAction<string>(SagaActionTypes.LoadItemMetadata);
const setSelectedItemByRoute = createAction<ZnsRouteRequest>(SagaActionTypes.SetItemByRoute);
const loadSelectedItemMetadata = createAction<FeedItem>(SagaActionTypes.LoadSelectedItemMetadata);

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
    setStatus: (state, action: PayloadAction<AsyncActionStatus>) => {
      state.status = action.payload;
    },
  },
});

export const { receive, select, setStatus } = slice.actions;
export const { reducer } =  slice;

export { load, loadItemMetadata, loadSelectedItemMetadata, setSelectedItemByRoute };
