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
      loadItemMetadata: () => undefined,
      ...props,
    };

    return shallow(<Container {...allProps} />);
  };

  it('loads feed item on mount', () => {
    const loadItemMetadata = jest.fn();

    subject({ id: 'the-item-id', loadItemMetadata });

    expect(loadItemMetadata).toHaveBeenCalledWith('the-item-id');
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
