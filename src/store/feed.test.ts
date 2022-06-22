import {
  reducer,
  receive,
  receiveItem,
  FeedState,
  AsyncActionStatus,
  setStatus,
  receiveSelectedItem,
} from './feed';
import { Model as FeedModel } from '../feed-model';

describe('feed reducer', () => {
  const initialExistingState: FeedState = {
    value: {
      ids: ['what'],
      entities: {
        'what': { id: 'what', title: 'the existing item' } as FeedModel,
        'thing': { id: 'thing', title: 'the other existing item' } as FeedModel,
      },
    },
    selectedItem: 'thing',
    status: AsyncActionStatus.Idle
  };

  const initialEmptyState: FeedState = {
    value: { ids: [], entities: {} },
    selectedItem: null,
    status: AsyncActionStatus.Idle,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      value: { ids: [], entities: {} },
      selectedItem: null,
      status: AsyncActionStatus.Idle,
    });
  });

  it('should handle receive with initial state', () => {
    const feedItems = [{
      id: 'first-id',
      title: 'the item',
      description: 'the description',
    }] as FeedModel[];

    const actual = reducer(initialEmptyState, receive(feedItems));

    expect(actual.value).toMatchObject({
      ids: ['first-id'],
      entities: {
        'first-id': {
          id: 'first-id',
          title: 'the item',
          description: 'the description',
        },
      },
    });
  });

  it('should handle receiveSelectedItem with initial state', () => {
    const feedItem = {
      id: 'first-id',
      title: 'the item',
      description: 'the description',
    } as FeedModel;

    const actual = reducer(initialEmptyState, receiveSelectedItem(feedItem));

    expect(actual).toMatchObject({
      selectedItem: 'first-id',
      value: {
        ids: [],
        entities: {
          'first-id': {
            id: 'first-id',
            title: 'the item',
            description: 'the description',
          },
        },
      },
    });
  });

  it('should replace existing ids in state', () => {
    const feedItems = [{
      id: 'first-id',
      title: 'the item',
      description: 'the description',
    }] as FeedModel[];

    const actual = reducer(initialExistingState, receive(feedItems));

    expect(actual.value.ids).toStrictEqual(['first-id']);
  });

  it('should merge items in state', () => {
    const feedItems = [{
      id: 'first-id',
      title: 'the item',
      description: 'the description',
    }, {
      id: 'what',
      description: 'the new description',
    }] as FeedModel[];

    const actual = reducer(initialExistingState, receive(feedItems));

    expect(actual.value).toMatchObject({
      ids: ['first-id', 'what'],
      entities: {
        'first-id': {
          id: 'first-id',
          title: 'the item',
          description: 'the description',
        },
        'thing': {
          id: 'thing',
          title: 'the other existing item',
        } as FeedModel,
        'what': {
          id: 'what',
          title: 'the existing item',
          description: 'the new description',
        },
      },
    });
  });

  it('should merge item in state for receiveSelectedItem', () => {
    const feedItem = {
      id: 'thing',
      description: 'the new description',
    } as FeedModel;

    const actual = reducer(initialExistingState, receiveSelectedItem(feedItem));

    expect(actual).toMatchObject({
      selectedItem: 'thing',
      value: {
        ids: ['what'],
        entities: {
          'what': {
            id: 'what',
            title: 'the existing item',
          },
          'thing': {
            id: 'thing',
            title: 'the other existing item',
            description: 'the new description',
          },
        },
      },
    });
  });

  it('should merge item in state for receiveItem', () => {
    const feedItem = {
      id: 'what',
      description: 'the new description',
    } as FeedModel;

    const actual = reducer(initialExistingState, receiveItem(feedItem));

    expect(actual.value).toMatchObject({
      ids: ['what'],
      entities: {
        'what': {
          id: 'what',
          title: 'the existing item',
          description: 'the new description',
        },
      },
    });
  });

  it('should add item to state for receiveItem', () => {
    const feedItem = {
      id: 'first-id',
      title: 'the item',
      description: 'the description',
    } as FeedModel;

    const actual = reducer(initialExistingState, receiveItem(feedItem));

    expect(actual.value).toMatchObject({
      ids: ['what'],
      entities: {
        'first-id': {
          id: 'first-id',
          title: 'the item',
          description: 'the description',
        },
        'thing': {
          id: 'thing',
          title: 'the other existing item',
        },
        'what': {
          id: 'what',
          title: 'the existing item',
        },
      },
    });
  });

  it('should replace status', () => {
    const actual = reducer(initialExistingState, setStatus(AsyncActionStatus.Loading));

    expect(actual.status).toEqual(AsyncActionStatus.Loading);
  });
});
