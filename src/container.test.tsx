import React from 'react';
import { shallow } from 'enzyme';
import { Container, Properties } from './container';
import { Feed } from './feed';
import { FeedLeafContainer } from './feed-leaf-container';
import { Model as FeedItemModel } from './feed-model';
import { RootState } from './store';
import { AsyncActionStatus } from './store/feed';
import { Spinner } from '@zer0-os/zos-component-library';

describe('FeedContainer', () => {
  const subject = (props: Partial<Properties> = {}) => {
    const allProps: Properties = {
      route: '',
      items: [],
      status: AsyncActionStatus.Idle,
      load: () => undefined,
      provider: null,
      web3: null,
      ...props,
    };

    return shallow(<Container {...allProps} />);
  };

  test('it loads feed for route on mount', () => {
    const load = jest.fn();
    const provider = { what: 'yeah' };
    const web3 = { chainId: 4 };

    subject({ load, provider, route: 'pickles', web3 });

    expect(load).toHaveBeenCalledWith({ route: 'pickles', provider });
  });

  test('it does not load empty feed on mount', () => {
    const load = jest.fn();
    const web3 = { chainId: 4 };

    subject({ load, provider: { what: 'yeah' }, web3, route: '' });

    expect(load).toHaveBeenCalledTimes(0);
  });

  test('it loads feed when route updates', () => {
    const load = jest.fn();
    const provider = { what: 'yeah' };
    const web3 = { chainId: 4 };

    const container = subject({ load, provider, web3, route: '' });

    container.setProps({ route: 'bob' });

    expect(load).toHaveBeenCalledWith({ route: 'bob', provider });
  });

  test('it loads feed when chainId updates', () => {
    const load = jest.fn();
    const provider = { what: 'yeah' };
    const web3 = { chainId: 4 };

    const container = subject({ load, provider, web3, route: 'bob' });

    container.setProps({ web3: { chainId: 1 } });

    expect(load).toHaveBeenCalledWith({ route: 'bob',  provider });
  });

  test('it renders feed leaf', () => {
    const wrapper = subject({ items: [], route: 'this.is.not.a.root' });

    expect(wrapper.find(FeedLeafContainer).exists()).toBe(true);
    expect(wrapper.find(Feed).exists()).toBe(false);
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

  it('renders spinner when loading', () => {
    const wrapper = subject({ status: AsyncActionStatus.Loading });

    expect(wrapper.find(Spinner).exists()).toBe(true);
  });

  it('does not render spinner when idle', () => {
    const wrapper = subject({ status: AsyncActionStatus.Idle });

    expect(wrapper.find(Spinner).exists()).toBe(false);
  });

  describe('mapState', () => {
    const subject = (state: RootState) => Container.mapState({
      feed: {
        value: {
          ids: [],
          entities: {},
          ...(state.feed.value || {}),
        },
        ...(state.feed || {}) },
    } as RootState);

    test('items', () => {
      const state = subject({
        feed: {
          value: {
            ids: ['the-first-id', 'the-second-id'],
            entities: {
              'the-first-id': {
                id: 'the-first-id',
                title: 'The First Item',
                description: 'This is the description of the first item.',
              },
              'the-second-id': {
                id: 'the-second-id',
                title: 'The Second Item',
                description: 'This is the description of the Second item.',
              },
            },
          },
        },
      } as any);

      expect(state).toMatchObject({
        items: [{
          id: 'the-first-id',
          title: 'The First Item',
          description: 'This is the description of the first item.',
        }, {
          id: 'the-second-id',
          title: 'The Second Item',
          description: 'This is the description of the Second item.',
        }],
      });
    });
  });
});
