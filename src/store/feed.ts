import {
  createSlice,
  createAction,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Model as FeedItem } from '../feed-model';
import getDeepProperty from 'lodash.get';

export enum SagaActionTypes {
  Load = 'feed/saga/load',
  LoadItemMetadata = 'feed/saga/loadItemMetadata',
  LoadSelectedItemMetadata = 'feed/saga/loadSelectedItemMetadata',
}

const load = createAction<ZnsRouteRequest>(SagaActionTypes.Load);
const loadItemMetadata = createAction<string>(SagaActionTypes.LoadItemMetadata);
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
  value: {
    ids: string[];
    entities: { [id: string]: FeedItem };
  },
  selectedItem: FeedItem;
  status: AsyncActionStatus;
}

const initialState: FeedState = {
  value: { ids: [], entities: {} },
  selectedItem: null,
  status: AsyncActionStatus.Idle,
};

const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    receive: (state, action: PayloadAction<FeedItem[]>) => {
      state.value = normalize(state.value, action.payload);
    },
    receiveItem: (state, action: PayloadAction<FeedItem>) => {
      const { id } = action.payload;
      const existingItems = state.value.entities;

      state.value.entities = {
        ...existingItems,
        [id]: {
          ...(existingItems[id] || {}),
          ...action.payload,
        },
      };
    },
    select: (state, action: PayloadAction<FeedItem>) => {
      state.selectedItem = action.payload;
    },
    setStatus: (state, action: PayloadAction<AsyncActionStatus>) => {
      state.status = action.payload;
    },
  },
});

const normalize = (state, items) => {
  const ids = [];
  const entities: any = {};
  const existingItems = state.entities;

  items.forEach((item) => {
    const { id } = item;

    ids.push(id);
    entities[id] = {
      ...(existingItems[id] || {}),
      ...item,
    };
  });

  return { ids, entities };
};

const denormalizeSingle = (state, id) => getDeepProperty(state, `feed.value.entities[${id}]`, null);

export const denormalize = (state, ids) => {
  if (!Array.isArray(ids)) {
    return denormalizeSingle(state, ids);
  }

  return ids.map(id => denormalizeSingle(state, id));
};

export const { receive, receiveItem, select, setStatus } = slice.actions;
export const { reducer } =  slice;

export { load, loadItemMetadata, loadSelectedItemMetadata };
