import React from 'react';
import { shallow } from 'enzyme';
import { FeedItemContainer as FeedItem } from './feed-item-container';
import { Model as FeedItemModel } from './feed-model';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Feed, Properties } from './feed';

const getItems = (numItems: number = 10) => {
  const items: any = [];

  for(let i = 1; i <= numItems; i++) {
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
      ...props,
    };

    return shallow(<Feed {...allProps} />);
  };

  test('passes id to FeedItem', () => {
    const items = getItems();

    const wrapper = subject({ items });

    expect(wrapper.find(FeedItem).at(1).prop('id')).toEqual(items[1].id);
  });

  it('should render full page if more items than page size', () => {
    const wrapper = subject({ items: getItems(10) });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);
  });

  it('should render partial page if less items than page size', () => {
    const wrapper = subject({ items: getItems(3) });

    expect(wrapper.find(FeedItem)).toHaveLength(3);
  });

  it('should set hasMore to true if more items than page size', () => {
    const wrapper = subject({ items: getItems(10) });

    expect(wrapper.find(InfiniteScroll).prop('hasMore')).toBe(true);
  });

  it('should render second page of items after next()', () => {
    const wrapper = subject({ items: getItems(10) });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    // triggering the scroll
    wrapper.find(InfiniteScroll).props().next();

    expect(wrapper.find(FeedItem)).toHaveLength(10);
  });

  it('should reset scroll if items update', () => {
    const firstSet = getItems(7);
    const secondSet = getItems(15).slice(7);

    const wrapper = subject({ items: firstSet });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    // triggering the scroll
    wrapper.find(InfiniteScroll).props().next();

    expect(wrapper.find(FeedItem)).toHaveLength(7);

    wrapper.setProps({ items: secondSet });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);
  });

  it('should set hasMore to true if items update and there are more items than page size', () => {
    const firstSet = getItems(7);
    const secondSet = getItems(15).slice(7);

    const wrapper = subject({ items: firstSet });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    // triggering the scroll
    wrapper.find(InfiniteScroll).props().next();

    expect(wrapper.find(FeedItem)).toHaveLength(7);

    wrapper.setProps({ items: secondSet });

    expect(wrapper.find(InfiniteScroll).prop('hasMore')).toBe(true);
  });

  it('should set hasMore to false if items update and there are less items than page size', () => {
    const firstSet = getItems(7);
    const secondSet = getItems(9).slice(7);

    const wrapper = subject({ items: firstSet });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    // triggering the scroll
    wrapper.find(InfiniteScroll).props().next();

    expect(wrapper.find(FeedItem)).toHaveLength(7);

    wrapper.setProps({ items: secondSet });

    expect(wrapper.find(InfiniteScroll).prop('hasMore')).toBe(false);
  });
});
