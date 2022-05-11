import React from 'react';
import { shallow } from 'enzyme';
import { FeedItem, Model as FeedItemModel } from './feed-item';
import { Feed, Properties } from './feed';

describe('Feed', () => {
  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      items: [],
      app: '',
      ...props,
    };

    return shallow(<Feed {...allProps} />);
  };

  test('renders a feed item for item', () => {
    const items = [
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
    ] as FeedItemModel[];

    const wrapper = subject({ items });

    expect(wrapper.find(FeedItem)).toHaveLength(2);
  });

  test('passes item props to FeedItem', () => {
    const items = [
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
    ] as FeedItemModel[];

    const wrapper = subject({ items });

    expect(wrapper.find(FeedItem).at(1).props()).toEqual(
      expect.objectContaining({
        id: 'the-second-id',
        title: 'The Second Item',
        description: 'This is the description of the Second item.',
      })
    );
  });
});
