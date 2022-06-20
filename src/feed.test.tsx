import React from 'react';
import { shallow } from 'enzyme';
import { FeedItemContainer as FeedItem } from './feed-item-container';
import { Model as FeedItemModel } from './feed-model';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Feed, Properties } from './feed';

const feedItemsTest = [
  {
    id: 'the-first-id',
    title: 'The First Item',
    description: 'This is the description of the first item.',
  },
  {
    id: 'the-second-id',
    title: 'The Second Item',
    description: 'This is the description of the Second item.',
  },
  {
    id: 'the-third-id',
    title: 'The 3 Item',
    description: 'This is the description of the 3 item.',
  },
  {
    id: '4',
    title: 'The 4 Item',
    description: 'This is the description of the 4 item.',
  },
  {
    id: '5',
    title: 'The 5 Item',
    description: 'This is the description of the 5 item.',
  },
  {
    id: '676',
    title: 'The 6 Item',
    description: 'This is the description of the 6 item.',
  },
  {
    id: '7-id',
    title: 'The 7 Item',
    description: 'This is the description of the 7 item.',
  },
  {
    id: '8',
    title: 'The 8 Item',
    description: 'This is the description of the 8 item.',
  },
  {
    id: '9',
    title: 'The 9 Item',
    description: 'This is the description of the 9 item.',
  },
] as FeedItemModel[];

describe('Feed', () => {
  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      items: [],
      ...props,
    };

    return shallow(<Feed {...allProps} />);
  };

  test('renders a feed item for item', () => {
    const wrapper = subject({ items: feedItemsTest.slice(0, 2) });

    expect(wrapper.find(FeedItem)).toHaveLength(2);
  });

  test('passes id to FeedItem', () => {
    const wrapper = subject({ items: feedItemsTest.slice(0, 2) });

    expect(wrapper.find(FeedItem).at(1).prop('id')).toEqual('the-second-id');
  });

  test('render the correct items initially', () => {
    const wrapper = subject({ items: feedItemsTest });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);
  });

  test('rendered items, if items are added to the end of the array', () => {
    const wrapper = subject({ items: feedItemsTest.slice(0, 7) });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    wrapper.setProps({ items: feedItemsTest.slice(0, 9) });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);
  });

  test('render the correct items on fetch', () => {
    const wrapper = subject({ items: feedItemsTest });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    // triggering the scroll
    wrapper.find(InfiniteScroll).props().next();

    expect(wrapper.find(FeedItem)).toHaveLength(9);
  });

  test('that we reset the scroll position, and rendered items, if the items change sufficiently to warrant that', () => {
    const wrapper = subject({ items: feedItemsTest.slice(0, 7) });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    // triggering the scroll
    wrapper.find(InfiniteScroll).props().next();

    expect(wrapper.find(FeedItem)).toHaveLength(7);

    wrapper.setProps({ items: feedItemsTest.slice(0, 9) });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);
  });

  test('that we maintain the correct scroll position, and rendered items, if items are added to the start of the array.', () => {
    const wrapper = subject({ items: feedItemsTest });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    expect(wrapper.find(FeedItem).at(0).prop('id')).toBe(feedItemsTest[0].id);

    const newItem = {
      id: 'this the new id',
      title: 'new title',
      description: 'this is the description',
    };

    wrapper.setProps({ items: [newItem, ...feedItemsTest] });

    expect(wrapper.find(FeedItem)).toHaveLength(Feed.pageSize);

    expect(wrapper.find(FeedItem).at(0).prop('id')).toBe(newItem.id);
    expect(wrapper.find(FeedItem).at(1).prop('id')).toBe(feedItemsTest[0].id);
  });
});
