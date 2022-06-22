import React from 'react';
import { shallow } from 'enzyme';
import { ZnsLink } from '@zer0-os/zos-component-library';

import { FeedItem, Properties } from './feed-item';
import CloudMedia from './components/cloud-media';

describe('FeedItem', () => {
  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      animationUrl: '',
      znsRoute: '',
      ...props,
    };

    return shallow(<FeedItem {...allProps} />);
  };

  test('renders image', () => {
    const wrapper = subject({ imageUrl: 'http://example.com/theimage.jpg' });

    expect(wrapper.find('.feed-item__image').prop('src')).toStrictEqual('http://example.com/theimage.jpg');
    
    wrapper.setProps({ animationUrl: '' });
    
    expect(wrapper.find('.feed-item__image').prop('src')).toStrictEqual('http://example.com/theimage.jpg');
  });

  test('renders image of animationUrl', () => {
    const wrapper = subject({ animationUrl: 'http://example.com/theimage_animation-url.jpg' });

    expect(wrapper.find('.feed-item__image').prop('src')).toStrictEqual('http://example.com/theimage_animation-url.jpg');
    
    wrapper.setProps({ imageUrl: 'http://example.com/theimage.jpg' });

    expect(wrapper.find('.feed-item__image').prop('src')).toStrictEqual('http://example.com/theimage_animation-url.jpg');

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

    const wrapper = subject({ title });

    expect(wrapper.find('.feed-item__title').text().trim()).toStrictEqual(title);
  });

  test('renders description', () => {
    const description = 'This is the description of the first item.';

    const wrapper = subject({ description });

    expect(wrapper.find('.feed-item__description').text().trim()).toStrictEqual(description);
  });

  test('renders title as link to route', () => {
    const wrapper = subject({
      id: 'the-first-id',
      znsRoute: 'the.route.yo',
    });

    const link = wrapper.find('.feed-item__title').closest(ZnsLink);

    expect(link.prop('route')).toStrictEqual('the.route.yo');
  });

  it('should pass width and height to cloudMedia', () => {
    const wrapper = subject({
      id: 'the-first-id',
      znsRoute: 'the.route.yo',
    });

    const cloudMedia = wrapper.find(CloudMedia);

    expect(cloudMedia.prop('width')).toEqual(440);
    expect(cloudMedia.prop('height')).toEqual(440);
  });
});
