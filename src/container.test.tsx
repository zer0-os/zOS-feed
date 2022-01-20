import React from 'react';
import { shallow } from 'enzyme';
import { Container, Properties } from './container';
import { Feed } from './feed';

describe('FeedContainer', () => {
  const subject = (props: Partial<Properties> = {}) => {
    const allProps: Properties = {
      route: '',
      items: [],
      load: () => undefined,
      provider: null,
      ...props,
    };

    return shallow(<Container {...allProps} />);
  };

  test('it loads feed for route on mount', () => {
    const load = jest.fn();
    const provider = { what: 'yeah' };

    subject({ load, provider, route: 'pickles' });

    expect(load).toHaveBeenCalledWith({ route: 'pickles', provider });
  });

  test('it does not load empty feed on mount', () => {
    const load = jest.fn();

    subject({ load, provider: { what: 'yeah' }, route: '' });

    expect(load).toHaveBeenCalledTimes(0);
  });

  test('it loads feed when route updates', () => {
    const load = jest.fn();
    const provider = { what: 'yeah' };

    const container = subject({ load, provider, route: '' });

    container.setProps({ route: 'bob' });

    expect(load).toHaveBeenCalledWith({ route: 'bob', provider });
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
    }];

    const wrapper = subject({ items });

    expect(wrapper.find(Feed).prop('items')).toEqual(items);
  });

  describe('mapState', () => {
    const subject = (state: any) => Container.mapState({
      feed: { value: [], ...(state.feed || {}) },
      zns: { value: { route: '' }, ...(state.zns || {}) },
    } as any);

    test('route', () => {
      const route = 'deep.fried.zucchini';

      const state = subject({ zns: { value: { route } } } as any);

      expect(state).toMatchObject({ route });
    });

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

      const state = subject({ feed: { value: items } } as any);

      expect(state).toMatchObject({ items });
    });
  });
});
