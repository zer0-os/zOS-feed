import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

import { FeedItem, Properties } from './feed-item';

let metadataServiceLoad;

describe('FeedItem', () => {
  beforeEach(() => {
    metadataServiceLoad = jest.fn();
  });


  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      znsRoute: '',
      app: '',
      metadataService: {
        load: metadataServiceLoad,
        normalizeUrl: jest.fn(),
        extractIpfsContentId: jest.fn(),
      },
      ...props,
    };

    return shallow(<FeedItem {...allProps} />);
  };

  test('renders image', () => {
    const wrapper = subject({
      imageUrl: 'http://example.com/theimage.jpg',
    });

    expect(wrapper.find('.feed-item__image').prop('src')).toStrictEqual('http://example.com/theimage.jpg');
  });

  it('adds title as alt text to image', () => {
    const wrapper = subject({
      title: 'what',
      imageUrl: 'http://example.com/theimage.jpg',
    });

    expect(wrapper.find('.feed-item__image').prop('alt')).toStrictEqual('what');
  });

  test('renders title', () => {
    const title = 'The First Item';

    const wrapper = subject({
      id: 'the-first-id',
      title,
      description: 'This is the description of the first item.',
    });

    expect(wrapper.find('.feed-item__title').text().trim()).toStrictEqual(title);
  });

  test('renders description', () => {
    const description = 'This is the description of the first item.';

    const wrapper = subject({
      id: 'the-first-id',
      title: 'The First Item',
      description,
    });

    expect(wrapper.find('.feed-item__description').text().trim()).toStrictEqual(description);
  });

  test('renders title as link to route', () => {
    const wrapper = subject({
      id: 'the-first-id',
      znsRoute: 'the.route.yo',
      app: 'app.id',
    });

    const link = wrapper.find('.feed-item__title').closest(Link);

    expect(link.prop('to')).toStrictEqual('/the.route.yo/app.id');
  });

  test('looks up metadata', async () => {
    const wrapper = subject({
      id: 'the-first-id',
      znsRoute: 'the.route.yo',
      app: 'the.app.id',
      metadataUrl: 'slow-ipfs-url',
    });

    expect(metadataServiceLoad).toHaveBeenCalledWith('slow-ipfs-url');
  });
});
