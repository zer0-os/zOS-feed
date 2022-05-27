import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

import { FeedItem, Properties } from './feed-item';
import * as utils from './util/feed';

let metadataService;
let metadataAbortController;
let setSelectedItem;

describe('FeedItem', () => {
  beforeEach(() => {
    metadataService = {
      normalize: jest.fn()
    };

    metadataAbortController = jest.fn();

    setSelectedItem = jest.fn();
  });

  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      item: {
        id: '',
        title: '',
        description: '',
        imageUrl: '',
      },
      znsRoute: '',
      app: '',
      metadataService,
      metadataAbortController,
      setSelectedItem,
      ...props,
    };

    return shallow(<FeedItem {...allProps} />);
  };

  test('renders image', () => {
    const wrapper = subject({
      item: {
        imageUrl: 'http://example.com/theimage.jpg',
      },
    });

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

    const wrapper = subject({
      item: {
        id: 'the-first-id',
        title,
        description: 'This is the description of the first item.',
      },
    });

    expect(wrapper.find('.feed-item__title').text().trim()).toStrictEqual(title);
  });

  test('renders description', () => {
    const description = 'This is the description of the first item.';

    const wrapper = subject({
      item: {
        id: 'the-first-id',
        title: 'The First Item',
        description,
      },
    });

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

  test('metadata updates item', async () => {
    const item = {
      id: 'the-first-id',
      znsRoute: 'the.route.yo',
      metadataUrl: 'slow-ipfs-url',
    };

    const expectation = {
      description: 'the-metadata-description',
    };

    utils.augmentWithMetadata = jest.fn().mockReturnValue({ ...item, ...expectation })

    const wrapper = await subject({ item });

    expect(utils.augmentWithMetadata).toHaveBeenCalledTimes(1);
    expect(wrapper.text().includes(expectation.description)).toBe(true)
  });

  test('metadata props are passed', () => {
    const item = {
      id: 'the-first-id',
      znsRoute: 'the.route.yo',
      metadataUrl: 'slow-ipfs-url',
    };

    utils.augmentWithMetadata = jest.fn().mockReturnValue({})

    subject({ item });

    expect(utils.augmentWithMetadata).toHaveBeenCalledWith(item, metadataService, metadataAbortController);
  });

  test('item is selected when route is followed', async () => {
    const item = {
      id: 'the-first-id',
      znsRoute: 'the.route.yo',
    };

    const wrapper = subject({ item });

    await wrapper.find('Link').simulate('click');

    expect(setSelectedItem).toHaveBeenCalledWith(item);
  });
});
