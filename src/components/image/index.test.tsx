import React from 'react';
import { shallow } from 'enzyme';
import Image from '.';
import { Properties } from './index';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';

describe('Images', () => {
  const subject = (props: Properties) => {
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
    const src =
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg';
    const wrapper = subject({
      className: 'feed-item__image',
      src,
    });

    expect(wrapper.find('.feed-item__image').prop('src')).toContain(src);
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
  describe('Cloudinary', () => {
    test('should have the correct className and publicId', () => {
      const CLASS_NAME_TEST = 'feed-item__image';
      const PUBLIC_ID_TEST = 'QmRLG913uKX7QxwSFMk1TMhtjxwy6kVek37HTcR7AtJUVf';

      const wrapper = subject({
        className: CLASS_NAME_TEST,
        src: `https://ipfs.fleek.co/ipfs/${PUBLIC_ID_TEST}`,
        useCloudinary: true,
      });

      expect(wrapper.find(AdvancedImage).prop('className')).toEqual(
        CLASS_NAME_TEST
      );
      expect(wrapper.find(AdvancedImage).prop('cldImg')).toEqual(
        expect.objectContaining({
          publicID: PUBLIC_ID_TEST,
        })
      );
    });

    test('should have transformation', () => {
      const CLASS_NAME_TEST = 'feed-item__image';
      const PUBLIC_ID_TEST = 'QmRLG913uKX7QxwSFMk1TMhtjxwy6kVek37HTcR7AtJUVf';

      const wrapper = subject({
        className: CLASS_NAME_TEST,
        src: `https://ipfs.fleek.co/ipfs/${PUBLIC_ID_TEST}`,
        useCloudinary: true,
        cloudinaryTransformable: (cloudinaryImage: CloudinaryImage) =>
          cloudinaryImage.resize(scale().width(480)),
      });

      expect(wrapper.find(AdvancedImage).prop('cldImg')).toHaveProperty('transformation');
    });
  });
});
