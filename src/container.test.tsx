import React from 'react';
import { shallow } from 'enzyme';
import { Container, Properties } from './container';
import { Feed } from './feed';
import { FeedLeaf } from './feed-leaf';
import { Model as FeedItemModel } from './feed-model';
import { RootState } from './store';
import { AsyncActionStatus } from './store/feed';

let setSelectedItem = jest.fn();
let setSelectedItemByRoute = jest.fn();

describe('FeedContainer', () => {
  const subject = (props: Partial<Properties> = {}) => {
    const allProps: Properties = {
      route: { znsRoute: '', app: '' },
      items: [],
      status: AsyncActionStatus.Idle,
      load: () => undefined,
      setSelectedItem,
      setSelectedItemByRoute,
      provider: null,
      ...props,
    };

    return shallow(<Container {...allProps} />);
  };

  test('it loads feed for route on mount', () => {
    const load = jest.fn();
    const provider = { what: 'yeah' };

    subject({ load, provider, route: { znsRoute: 'pickles', app: 'feed' } });

    expect(load).toHaveBeenCalledWith({ route: 'pickles', provider });
  });

  test('it does not load empty feed on mount', () => {
    const load = jest.fn();

    subject({ load, provider: { what: 'yeah' }, route: { znsRoute: 'not.a.root.domain', app: '' } });

    expect(load).toHaveBeenCalledTimes(0);
  });

  test('it loads feed when route updates', () => {
    const load = jest.fn();
    const provider = { what: 'yeah' };

    const container = subject({ load, provider, route: { znsRoute: '', app: '' } });

    container.setProps({ route: { znsRoute: 'bob', app: 'feed' } });

    expect(load).toHaveBeenCalledWith({ route: 'bob', provider });
  });

  test('it sets selected item when route updates and is leaf node', () => {
    const route = 'this.is.not.a.root.node';
    const provider = { what: 'yeah' };

    subject({ setSelectedItemByRoute, provider, route: { znsRoute: route, app: 'feed' } });

    expect(setSelectedItemByRoute).toHaveBeenCalledWith({ route, provider });
  });

  test('it renders feed leaf', () => {
    const wrapper = subject({ items: [], route: { znsRoute: 'this.is.not.a.root' } });

    expect(wrapper.find(FeedLeaf).exists()).toBe(true)
    expect(wrapper.find(Feed).exists()).toBe(false)
  });

  test('passes items to child', () => {
    const items = [{
      id: 'the-first-id',
      title: 'The First Item',
      description: 'This is the description of the first item.',
    }, {
      id: 'the-second-id',
      title: 'The Second Item',
      description: 'This is the description of the Second item.',
    }] as FeedItemModel[];

    const wrapper = subject({ items });

    expect(wrapper.find(Feed).prop('items')).toEqual(items);
  });

  test('passes loading to feed', () => {
    const wrapper = subject({ status: AsyncActionStatus.Loading });

    expect(wrapper.find(Feed).prop('isLoading')).toEqual(true);
  });

  describe('mapState', () => {
    const subject = (state: RootState) => Container.mapState({
      feed: { value: [], ...(state.feed || {}) },
    } as RootState);

    test('items', () => {
      const items = [{
        id: 'the-first-id',
        title: 'The First Item',
        description: 'This is the description of the first item.',
      }, {
        id: 'the-second-id',
        title: 'The Second Item',
        description: 'This is the description of the Second item.',
      }];

      const state = subject({ feed: { value: items } } as RootState);

      expect(state).toMatchObject({ items });
    });

    test('selected item for leaf node', () => {
      const selectedItem = {
        id: 'the-first-id',
        title: 'The First Item',
        description: 'This is the description of the first item.',
      };

      const state = subject({ feed: { value: [], selectedItem } } as RootState);

      expect(state).toMatchObject({ selectedItem });
    });
  });
});
