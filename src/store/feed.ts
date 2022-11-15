import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { Model as FeedItem } from '../feed-model';
import getDeepProperty from 'lodash.get';

export enum SagaActionTypes {
  Load = 'feed/saga/load',
  FetchMore = 'feed/saga/fetchMore',
  LoadItemMetadata = 'feed/saga/loadItemMetadata',
}

const load = createAction<ZnsRouteRequest>(SagaActionTypes.Load);
const fetchMore = createAction<ZnsRouteRequest>(SagaActionTypes.FetchMore);
const loadItemMetadata = createAction<string>(SagaActionTypes.LoadItemMetadata);

export interface ZnsRouteRequest {
  route: string;
  provider: any;
  offset: number;
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
  };
  selectedItem: string;
  status: AsyncActionStatus;
  hasMore: boolean;
}

const initialState: FeedState = {
  value: { ids: [], entities: {} },
  selectedItem: null,
  status: AsyncActionStatus.Idle,
  hasMore: true,
};

const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    receive: (state, action: PayloadAction<FeedItem[]>) => {
      state.value = normalize(state.value, action.payload);
    },
    setFeeds: (state, action: PayloadAction<FeedItem[]>) => {
      state.value = normalize(state.value, action.payload, true);
      if (!action.payload.length) {
        state.hasMore = false;
      }
    },
    receiveItem: (state, action: PayloadAction<FeedItem>) => {
      const { entities } = normalize(state.value, action.payload);

      state.value.entities = entities;
    },
    receiveSelectedItem: (state, action: PayloadAction<FeedItem>) => {
      const { entities } = normalize(state.value, action.payload);

      state.selectedItem = action.payload.id;
      state.value.entities = entities;
    },
    setStatus: (state, action: PayloadAction<AsyncActionStatus>) => {
      state.status = action.payload;
    },
  },
});

// note that this currently returns a full set
// of entities merged with the new ones.
// if we want to use this externally, we'll
// want to separate that, so that this only
// returns the entitites that we are currently
// processing.
const normalize = (state, items, more = false) => {
  if (!Array.isArray(items)) {
    items = [items];
  }

  let ids = [];
  const entities: any = {
    ...state.entities,
  };

  if (more) {
    ids = state.ids;
  }

  items.forEach((item) => {
    const { id } = item;

    ids.push(id);
    entities[id] = {
      ...(entities[id] || {}),
      ...item,
    };
  });

  return { ids, entities };
};

const denormalizeSingle = (state, id) =>
  getDeepProperty(state, `feed.value.entities[${id}]`, null);

export const denormalize = (state, ids) => {
  if (!Array.isArray(ids)) {
    return denormalizeSingle(state, ids);
  }

  return ids.map((id) => denormalizeSingle(state, id));
};

export const {
  receive,
  setFeeds,
  receiveItem,
  receiveSelectedItem,
  setStatus,
} = slice.actions;
export const { reducer } = slice;

export { load, loadItemMetadata, fetchMore };
