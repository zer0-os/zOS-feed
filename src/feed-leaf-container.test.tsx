import React from 'react';
import { shallow } from 'enzyme';
import { Container, Properties } from './feed-leaf-container';
import { FeedLeaf } from './feed-leaf';
import { RootState } from './store';

describe('FeedLeafContainer', () => {
  const subject = (props: Partial<Properties> = {}) => {
    const allProps: Properties = {
      id: '',
      item: null,
      loadSelectedItemMetadata: () => undefined,
      ...props,
    };

    return shallow(<Container {...allProps} />);
  };

  it('loads metadata on mount', () => {
    const loadSelectedItemMetadata = jest.fn();

    subject({ loadSelectedItemMetadata });

    expect(loadSelectedItemMetadata).toHaveBeenCalled();
  });

  it('loads metadata on update', () => {
    const loadSelectedItemMetadata = jest.fn();

    const wrapper = subject({ loadSelectedItemMetadata });
    wrapper.setProps({ item: { id: 'something-new' }});

    expect(loadSelectedItemMetadata).toHaveBeenCalledTimes(2);
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
    const subject = (state: RootState, props: Partial<Properties> = {}) => Container.mapState({
      feed: { value: [], ...(state.feed || {}) },
    } as RootState, props as Properties);

    test('item', () => {
      const selectedItem = {
        id: 'the-first-id',
        title: 'The First Item',
        description: 'This is the description of the first item.',
      };

      const { item } = subject({ feed: { selectedItem } } as RootState, { item: selectedItem });

      expect(item).toMatchObject(selectedItem);
    });
  });
});
