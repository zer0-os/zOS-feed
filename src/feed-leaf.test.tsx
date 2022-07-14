import React from 'react';
import { shallow } from 'enzyme';
import { shorty } from './util/feed';

import { FeedLeaf, Properties } from './feed-leaf';

describe('FeedLeaf', () => {
  const subject = (props: Partial<Properties>) => {
    const allProps: Properties = {
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      animationUrl: '',
      minter: '',
      owner: '',
      attributes: [],
      ipfsContentId: '',
      metadataUrl: '',
      chainId: null,
      contract: '',
      znsRoute: '',

      ...props,
    };

    return shallow(<FeedLeaf {...allProps} />);
  };

  it('renders image', () => {
    const wrapper = subject({ imageUrl: 'http://example.com/theimage.jpg' });

    expect(wrapper.find('.feed-leaf__image').prop('src')).toStrictEqual('http://example.com/theimage.jpg');
    
    wrapper.setProps({ animationUrl: '' });
    
    expect(wrapper.find('.feed-leaf__image').prop('src')).toStrictEqual('http://example.com/theimage.jpg');
  });

  it('renders image of animationUrl', () => {
    const wrapper = subject({ animationUrl: 'http://example.com/theimage_animation-url.jpg' });

    expect(wrapper.find('.feed-leaf__image').prop('src')).toStrictEqual('http://example.com/theimage_animation-url.jpg');
    
    wrapper.setProps({ imageUrl: 'http://example.com/theimage.jpg' });

    expect(wrapper.find('.feed-leaf__image').prop('src')).toStrictEqual('http://example.com/theimage_animation-url.jpg');

  });

  it('adds title as alt text to image', () => {
    const wrapper = subject({
      title: 'what',
      imageUrl: 'http://example.com/theimage.jpg',
    });

    expect(wrapper.find('[className$="__image"]').prop('alt')).toStrictEqual('what');
  });

  it('renders title', () => {
    const title = 'The First Item';

    const wrapper = subject({ title });

    expect(wrapper.find('[className$="__title"]').text().trim()).toStrictEqual(title);
  });

  it('renders description', () => {
    const description = 'This is the description of the first item.';

    const wrapper = subject({ description });

    expect(wrapper.find('[className$="__description"]').text().trim()).toStrictEqual(description);
  });

  it('renders minter and owner', () => {
    const minter = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const owner = '0x0000000000000000000000000000000000000000000000000000000000000001';

    const wrapper = subject({ minter, owner });

    const roles = wrapper.find('[className$="__member"]').map(item => item.text()).join();

    [owner, minter].forEach(role => {
      expect(roles.includes(shorty(role))).toBe(true);
    })
  });
  
  it('renders share button', () => {
    const znsRoute = 'wilder.WoW.poster.001';
    const wrapper = subject({ znsRoute });

    expect(wrapper.find('.feed-leaf__share').exists()).toBe(true);    
  });

  it('renders link to twitter', () => {
    const wrapper = subject({ znsRoute: 'wilder.WoW.poster.001' });

    const expectedLink = 'https://twitter.com/intent/tweet?url=https://share.market.wilderworld.com/WoW.poster.001';

    expect(wrapper.find('.feed-leaf__share').prop('href')).toStrictEqual(expectedLink);
  });

  it('renders empty link if znsRoute does not start with wilder', () => {
    const wrapper = subject({ znsRoute: 'WoW.poster.001' });

    expect(wrapper.find('.feed-leaf__share').prop('href')).toStrictEqual('/');
  });

  it('renders attributes', () => {
    const attribute = { trait_type: "attribute name", value: "attribute value" };

    const wrapper = subject({ attributes: [attribute] });

    expect(wrapper.find('[className$="__attribute-name"]').text().trim()).toStrictEqual(attribute.trait_type);
    expect(wrapper.find('[className$="__attribute-value"]').text().trim()).toStrictEqual(attribute.value);
  });

  it('renders external resources', () => {
    const ipfsContentId = 'super-slow-ipfs-link';

    const wrapper = subject({ ipfsContentId });

    const resources = wrapper.find('[className$="__external-resource"]').map(item => item.text()).join();

    expect(resources.includes('su...link')).toBe(true);
  });

  it('copy domain id', () => {
    const ipfsContentId = 'super-slow-ipfs-link';
    const wrapper = subject({
      ipfsContentId
    });
    const onCopySpy = jest.fn();
    (wrapper.instance() as FeedLeaf).onCopy = onCopySpy;

    const copyButton = wrapper.find('.feed-leaf__copy');
    copyButton.simulate('click');

    expect(onCopySpy).toHaveBeenCalledWith(ipfsContentId);
  });
});
