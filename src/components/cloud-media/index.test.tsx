import React from 'react';
import { shallow } from 'enzyme';
import { Component } from '.';
import { ComponentProperties } from './index';
import { AdvancedImage, AdvancedVideo } from '@cloudinary/react';
import { CloudinaryMedia, MediaType } from './types';
import cloudinaryInstance from './cloudinary';

describe('CloudMedia', () => {
  const hash = 'QmT1XisCk7QMQwSdJFSDJkusWpASuYpQYN5ZS5rM2NbdFM';
  const IPFS_LINK = `https://ipfs.fleek.co/ipfs/${hash}`;

  const getHashFromIpfsUrlMocked = jest.fn(() => hash);
  const getCloudMediaMocked = jest.fn(() =>
    Promise.resolve(({
      type: MediaType.Image,
      media: cloudinaryInstance.image(hash),
    } as unknown) as CloudinaryMedia)
  );

  const subject = (props?: Partial<ComponentProperties>) => {
    const allProps: ComponentProperties = {
      src: IPFS_LINK,
      className: '',
      alt: '',
      getCloudMedia: getCloudMediaMocked,
      getHashFromIpfsUrl: getHashFromIpfsUrlMocked,
      ...props,
    };

    return shallow(<Component {...allProps} />);
  };

  it('should pass src to getHashFromIpfsUrl', () => {
    const wrapper = subject();

    expect(getHashFromIpfsUrlMocked).toBeCalledWith(IPFS_LINK);
  });

  it('should pass hash to getCloudMedia', () => {
    const wrapper = subject();

    expect(getCloudMediaMocked).toBeCalledWith(hash);
  });

  it('renders image', () => {
    const wrapper = subject({
      className: 'item_image',
    });
    expect(wrapper.find('.item_image').exists()).toBe(true);
  });

  it('renders loading', () => {
    const wrapper = subject();
    expect(wrapper.find('.spinner').exists()).toBe(true);
    expect(wrapper.find('.cloud-media__wrapper--loading').exists()).toBe(true);
  });

  it('adds title as alt text to image', async () => {
    const wrapper = subject({
      alt: 'what',
      className: 'feed-item__image',
    });
    await wrapper.instance().componentDidMount();

    expect(wrapper.find(AdvancedImage).prop('alt')).toStrictEqual('what');
  });

  it('renders null when src in undefined', () => {
    const wrapper = subject({
      className: 'feed-item',
      src: '',
    });

    expect(wrapper.find('.item_image').exists()).toBe(false);
  });

  it('should have the correct publicId on AdvancedImage', async () => {
    const wrapper = subject();

    await wrapper.instance().componentDidMount();

    expect(wrapper.find(AdvancedImage).prop('cldImg')).toEqual(
      expect.objectContaining({
        publicID: hash,
      })
    );
  });

  it('should have transformation', async () => {
    const wrapper = subject();

    await wrapper.instance().componentDidMount();

    expect(wrapper.find(AdvancedImage).prop('cldImg')).toHaveProperty(
      'transformation'
    );
  });

  it('should show a spinner', () => {
    const wrapper = subject();

    expect(wrapper.hasClass('spinner')).toBe(true);

    (wrapper.instance() as Component).onLoad();

    expect(wrapper.hasClass('spinner')).toBe(false);
  });

  it('should render image from another domain', async () => {
    const src = 'https://domain.com/image.jpg';

    const wrapper = subject({
      src,
      getHashFromIpfsUrl: jest.fn(() => src),
      getCloudMedia: jest.fn(() =>
        Promise.resolve(({
          type: MediaType.Image,
          media: cloudinaryInstance.image(src),
        } as unknown) as CloudinaryMedia)
      ),
    });

    await wrapper.instance().componentDidMount();

    expect(wrapper.find(AdvancedImage).prop('cldImg')).toEqual(
      expect.objectContaining({
        publicID: src,
      })
    );
  });

  it('should render video from another domain', async () => {
    const src = 'https://domain.com/video.webm';

    const wrapper = subject({
      src,
      getHashFromIpfsUrl: jest.fn(() => src),
      getCloudMedia: jest.fn(() =>
        Promise.resolve(({
          type: MediaType.Video,
          media: cloudinaryInstance.video(src),
        } as unknown) as CloudinaryMedia)
      ),
    });

    await wrapper.instance().componentDidMount();

    expect(wrapper.find(AdvancedVideo).prop('cldVid')).toEqual(
      expect.objectContaining({
        publicID: src,
      })
    );
  });
});
