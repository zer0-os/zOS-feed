import React from 'react';
import { shallow } from 'enzyme';
import { Container, Properties } from './feed-item-container';
import { FeedItem } from './feed-item';
import { RootState } from './store';

describe('FeedContainer', () => {
  const subject = (props: Partial<Properties> = {}) => {
    const allProps: Properties = {
      id: '',
      item: null,
      load: () => undefined,
      ...props,
    };

    return shallow(<Container {...allProps} />);
  };

  it('loads feed item on mount', () => {
    const load = jest.fn();

    subject({ id: 'the-item-id', load });

    expect(load).toHaveBeenCalledWith('the-item-id');
  });

  it('propagates setSelectedItem', () => {
    const item = {
      id: 'the-item-id',
      title: 'the title',
      description: 'the full item description',
      imageUrl: 'example.com/image.jpg',
      znsRoute: 'where.are.we',
    };

    const setSelectedItem = jest.fn();

    const wrapper = subject({ id: 'the-item-id', setSelectedItem });

    (wrapper.find(FeedItem).prop('setSelectedItem') as any)(item);

    expect(setSelectedItem).toHaveBeenCalledWith(item);
  });

  it('passes app to child', () => {
    const wrapper = subject({ app: 'feed' });

    expect(wrapper.find(FeedItem).prop('app')).toBe('feed');
  });

  it('passes feed item properties to child', () => {
    const wrapper = subject({
      item: {
        id: 'the-item-id',
        title: 'the title',
        description: 'the full item description',
        imageUrl: 'example.com/image.jpg',
        znsRoute: 'where.are.we', 
      },
    });

    expect(wrapper.find(FeedItem).props()).toMatchObject({
      title: 'the title',
      description: 'the full item description',
      imageUrl: 'example.com/image.jpg',
      znsRoute: 'where.are.we', 
    });
  });

  describe('mapState', () => {
    const subject = (state: RootState, props: Partial<Properties> = {}) => Container.mapState({
      feed: { value: [], ...(state.feed || {}) },
    } as RootState, props as Properties);

    test('item', () => {
      const items = [{
        id: 'the-first-id',
        title: 'The First Item',
        description: 'This is the description of the first item.',
      }, {
        id: 'the-second-id',
        title: 'The Second Item',
        description: 'This is the description of the Second item.',
      }];

      const { item } = subject({ feed: { value: items } } as RootState, { id: 'the-second-id' });

      expect(item).toMatchObject(items[1]);
    });
  });
});
