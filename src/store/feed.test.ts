import {
  reducer,
  receive,
  FeedState,
  AsyncActionStatus,
} from './feed';
import { Model as FeedModel } from '../feed-model';

describe('feed reducer', () => {
  const initialExistingState: FeedState = {
    value: [{ id: 'what', title: 'the existing item' }] as FeedModel[],
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
    }] as FeedModel[];

    const actual = reducer(initialEmptyState, receive(feedItems));

    expect(actual.value).toEqual(feedItems);
  });

  it('should replace existing state', () => {
    const feedItems = [{
      id: 'first-id',
      title: 'the item',
      description: 'the desription',
    }] as FeedModel[];

    const actual = reducer(initialExistingState, receive(feedItems));

    expect(actual.value).toEqual(feedItems);
  });
});
