import {
  reducer,
  receive,
  FeedState,
  AsyncActionStatus,
  setStatus,
} from './feed';
import { Model as FeedItem } from '../feed-item';

describe('feed reducer', () => {
  const initialExistingState: FeedState = {
    value: [{ id: 'what', title: 'the existing item' }] as FeedItem[],
    status: AsyncActionStatus.Idle
  };

  const initialEmptyState: FeedState = {
    value: null,
    status: AsyncActionStatus.Idle,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      value: [],
      status: AsyncActionStatus.Idle,
    });
  });

  it('should handle receive with initial state', () => {
    const feedItems = [{
      id: 'first-id',
      title: 'the item',
      description: 'the desription',
    }] as FeedItem[];

    const actual = reducer(initialEmptyState, receive(feedItems));

    expect(actual.value).toEqual(feedItems);
  });

  it('should replace existing state', () => {
    const feedItems = [{
      id: 'first-id',
      title: 'the item',
      description: 'the desription',
    }] as FeedItem[];

    const actual = reducer(initialExistingState, receive(feedItems));

    expect(actual.value).toEqual(feedItems);
  });

  it('should replace status', () => {
    const actual = reducer(initialExistingState, setStatus(AsyncActionStatus.Loading));

    expect(actual.status).toEqual(AsyncActionStatus.Loading);
  });
});
