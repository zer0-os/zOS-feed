import React from 'react';
import { shallow } from 'enzyme';
import Image from '.';

export interface Properties {
  src: string;
  className: string;
  alt: string;
}

describe('Cloudinary images', () => {
  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      src: '',
      className: '',
      alt: '',
      ...props,
    };

    return shallow(<Image {...allProps} />);
  };

  test('renders image', () => {
    const wrapper = subject({
      className: 'item_image',
    });

    expect(wrapper.find('.item_image').exists()).toBe(true);
  });

  it('adds title as alt text to image', () => {
    const wrapper = subject({
      alt: 'what',
      className: 'feed-item__image',
    });

    expect(wrapper.find('.feed-item__image').prop('alt')).toStrictEqual('what');
  });

  test('renders image contain cloudinary url', () => {
    const wrapper = subject({
      className: 'feed-item__image',
      src:
        'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
    });

    expect(wrapper.find('.feed-item__image').prop('src')).toContain(
      'res.cloudinary'
    );
  });

  it('adds title as alt text to image', () => {
    const wrapper = subject({
      alt: 'whatImg',
      className: 'feed-item__image',
      src: 'http://example.com/theimage.jpg',
    });

    expect(wrapper.find('.feed-item__image').prop('alt')).toStrictEqual(
      'whatImg'
    );
  });
});
