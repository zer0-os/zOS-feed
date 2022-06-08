import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

import { FeedItem, Properties } from './feed-item';

let setSelectedItem;

describe('FeedItem', () => {
  beforeEach(() => {
    setSelectedItem = jest.fn();
  });

  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      item: {
        id: '',
        title: '',
        description: '',
        imageUrl: '',
        znsRoute: '',
      },

      app: '',
      setSelectedItem,
      ...props,
    };

    return shallow(<FeedItem {...allProps} />);
  };

  test('renders image', () => {
    const wrapper = subject({ item: { imageUrl: 'http://example.com/theimage.jpg' } });

    expect(wrapper.find('.feed-item__image').prop('src')).toStrictEqual('http://example.com/theimage.jpg');
  });

  it('adds title as alt text to image', () => {
    const wrapper = subject({
      item: {
        title: 'what',
        imageUrl: 'http://example.com/theimage.jpg',
      },
    });

    expect(wrapper.find('.feed-item__image').prop('alt')).toStrictEqual('what');
  });

  test('renders title', () => {
    const title = 'The First Item';

    const wrapper = subject({ item: { title } });

    expect(wrapper.find('.feed-item__title').text().trim()).toStrictEqual(title);
  });

  test('renders description', () => {
    const description = 'This is the description of the first item.';

    const wrapper = subject({ item: { description } });

    expect(wrapper.find('.feed-item__description').text().trim()).toStrictEqual(description);
  });

  test('renders title as link to route', () => {
    const wrapper = subject({
      item: {
        id: 'the-first-id',
        znsRoute: 'the.route.yo',
      },
      app: 'app.id',
    });

    const link = wrapper.find('.feed-item__title').closest(Link);

    expect(link.prop('to')).toStrictEqual('/the.route.yo/app.id');
  });

  test('item is selected when route is followed', async () => {
    const item = {
      id: 'the-item-id',
      title: 'the title',
      description: 'the full item description',
      imageUrl: 'example.com/image.jpg',
      znsRoute: 'where.are.we',
    };

    const wrapper = subject({ item });

    await wrapper.find('Link').simulate('click');

    expect(setSelectedItem).toHaveBeenCalledWith(item);
  });
});
