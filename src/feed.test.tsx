import React from 'react';
import { shallow } from 'enzyme';
import { FeedItemContainer as FeedItem } from './feed-item-container';
import { Model as FeedItemModel } from './feed-model';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Feed, Properties } from './feed';
import { limit } from './store/saga';

const getItems = (numItems: number = 10) => {
  const items: any = [];

  for (let i = 1; i <= numItems; i++) {
    items.push({
      id: `item-id-${i}`,
      title: `Item Title #${i}`,
      description: `This is the description of item #${i}.`,
    });
  }

  return items as FeedItemModel[];
};

describe('Feed', () => {
  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      items: [],
      hasMore:true,
      fetchMoreFeed: () => undefined,
      ...props,
    };

    return shallow(<Feed {...allProps} />);
  };

  test('passes id to FeedItem', () => {
    const items = getItems();

    const wrapper = subject({ items });

    expect(wrapper.find(FeedItem).at(1).prop('id')).toEqual(items[1].id);
  });

  it('should render full page if items have data', () => {
    const wrapper = subject({ items: getItems(10) });

    expect(wrapper.find(FeedItem)).toHaveLength(limit);
  });

  it('should render partial page if less items than limit', () => {
    const wrapper = subject({ items: getItems(3) });

    expect(wrapper.find(FeedItem)).toHaveLength(3);
  });

  it('should not render second page if hasMore false', () => {
    const fetchMoreFeed = jest.fn();
    const wrapper = subject({ items: getItems(10), hasMore: false, fetchMoreFeed });

    expect(wrapper.find(InfiniteScroll).prop('hasMore')).toBe(false);

    wrapper.find(InfiniteScroll).props().next();
    expect(wrapper.find(FeedItem)).toHaveLength(limit);
  });

  it('should render second page of items after next()', () => {
    const fetchMoreFeed = jest.fn();
    const wrapper = subject({ items: getItems(10), hasMore: true, fetchMoreFeed });

    expect(wrapper.find(FeedItem)).toHaveLength(limit);

    // triggering the scroll
    wrapper.find(InfiniteScroll).props().next();

    expect(fetchMoreFeed).toHaveBeenCalled();
  });

  it('should passes scrollableTarget to InfiniteScroll', () => {
    const wrapper = subject({ items: getItems(10) });

    expect(wrapper.find('#feed').exists()).toBe(true);

    expect(wrapper.find(InfiniteScroll).props().scrollableTarget).toEqual(
      'feed'
    );
  });
});
