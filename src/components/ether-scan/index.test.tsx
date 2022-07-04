import React from 'react';
import { shallow } from 'enzyme';
import EtherScan from '.';

describe('Etherscan', () => {
  const subject = (props: Properties) => {
    const allProps: Properties = {
      className: '',
      domainId: '',
      chainId: 0,
      znsDomain: '',
      ...props,
    };

    return shallow(<EtherScan {...allProps} />);
  };

  it('renders item_etherscan', () => {
    const wrapper = subject({
      className: 'feed-leaf__external-resource',
    });

    expect(wrapper.find('.feed-leaf__external-resource').exists()).toBe(true);
  });

  it('adds domainId as title', () => {
    const wrapper = subject({
      className: 'feed-leaf__external-resource',
      domainId: '0x81a20587',
    });

    expect(wrapper.find('.feed-leaf__external-resource').prop('title')).toStrictEqual('0x81a20587');
  });

  it('renders empty string when chainId is null', () => {
    const wrapper = subject({
      className: 'feed-leaf__external-resource',
      chainId: '',
    });

    expect(wrapper.find('.feed-leaf__external-resource a').first().prop('href')).toStrictEqual('');
  });


  it('copy domain id', () => {
    const DOMAIN_ID_TEST = '0x81a20587';
    const wrapper = subject({
      className: 'feed-leaf__external-resource',
      domainId: DOMAIN_ID_TEST,
    });
    const onCopySpy = jest.fn();
    (wrapper.instance() as EtherScan).onCopy = onCopySpy;

    const copyButton = wrapper.find('.feed-leaf__copy');
    copyButton.simulate('click');

    expect(onCopySpy).toHaveBeenCalledWith(DOMAIN_ID_TEST);
  });
});