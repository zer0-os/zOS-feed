import React from 'react';
import { shallow } from 'enzyme';
import { Container, Properties } from './feed-leaf-container';
import { FeedLeaf } from './feed-leaf';
import { RootState } from './store';

describe('FeedLeafContainer', () => {
  const subject = (props: Partial<Properties> = {}) => {
    const allProps: Properties = {
      item: null,
      loadMetadata: () => undefined,
      ...props,
    };

    return shallow(<Container {...allProps} />);
  };

  it('loads metadata on mount', () => {
    const loadMetadata = jest.fn();

    subject({ item: { id: 'the-id' } as any, loadMetadata });

    expect(loadMetadata).toHaveBeenCalledWith('the-id');
  });

  it('does not load metadata on mount if item not present', () => {
    const loadMetadata = jest.fn();

    subject({ item: null, loadMetadata });

    expect(loadMetadata).toHaveBeenCalledTimes(0);
  });

  it('loads metadata on update', () => {
    const loadMetadata = jest.fn();

    const wrapper = subject({ loadMetadata });

    wrapper.setProps({ item: { id: 'something-new' }});

    expect(loadMetadata).toHaveBeenCalledWith('something-new');
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

    expect(wrapper.find(FeedLeaf).props()).toMatchObject({
      title: 'the title',
      description: 'the full item description',
      imageUrl: 'example.com/image.jpg',
      znsRoute: 'where.are.we',
    });
  });

  describe('mapState', () => {
    const subject = (state: RootState) => Container.mapState({
      feed: {
        selectedItem: '',
        ...state.feed,
        value: {
          ...(state.feed.value || {}),
        },
      },
    } as RootState);

    test('item', () => {
      const selectedItem = {
        id: 'the-first-id',
        title: 'The First Item',
        description: 'This is the description of the first item.',
      };

      const { item } = subject({
        feed: {
          selectedItem: 'the-first-id',
          value: {
            entities: {
              'the-first-id': selectedItem,
            },
          },
        },
      } as any);

      expect(item).toMatchObject(selectedItem);
    });
  });
});
