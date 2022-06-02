import React from 'react';
import { shallow } from 'enzyme';
import CloudImage from '.';
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

    return shallow(<CloudImage {...allProps} />);
  };

  it('renders image', () => {
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
    it('should have the correct className and publicId', () => {
      const CLASS_NAME_TEST = 'feed-item__image';
      const PUBLIC_ID_TEST = 'QmRLG913uKX7QxwSFMk1TMhtjxwy6kVek37HTcR7AtJUVf';

      const wrapper = subject({
        className: CLASS_NAME_TEST,
        src: `https://ipfs.fleek.co/ipfs/${PUBLIC_ID_TEST}`,
      });

      expect(wrapper.find(AdvancedImage).hasClass(CLASS_NAME_TEST)).toBe(true);
      expect(wrapper.find(AdvancedImage).prop('cldImg')).toEqual(
        expect.objectContaining({
          publicID: PUBLIC_ID_TEST,
        })
      );
    });

    it('should have transformation', () => {
      const CLASS_NAME_TEST = 'feed-item__image';
      const PUBLIC_ID_TEST = 'QmRLG913uKX7QxwSFMk1TMhtjxwy6kVek37HTcR7AtJUVf';

      const wrapper = subject({
        className: CLASS_NAME_TEST,
        src: `https://ipfs.fleek.co/ipfs/${PUBLIC_ID_TEST}`,
        cloudinaryTransformable: (cloudinaryImage: CloudinaryImage) =>
          cloudinaryImage.resize(scale().width(480)),
      });

      expect(wrapper.find(AdvancedImage).prop('cldImg')).toHaveProperty(
        'transformation'
      );
    });

    it('should show a spinner', () => {
      const CLASS_NAME_TEST = 'feed-item__image';
      const PUBLIC_ID_TEST = 'QmRLG913uKX7QxwSFMk1TMhtjxwy6kVek37HTcR7AtJUVf';

      const wrapper = subject({
        className: CLASS_NAME_TEST,
        src: `https://ipfs.fleek.co/ipfs/${PUBLIC_ID_TEST}`,
      });

      expect(wrapper.find(AdvancedImage).hasClass('spinner')).toBe(true);

      (wrapper.instance() as CloudImage).onLoad();

      expect(wrapper.find(AdvancedImage).hasClass('spinner')).toBe(false);
    });
  });
});
