import React from 'react';
import { shallow } from 'enzyme';
import EtherScan from '../ether-scan';

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

    expect(wrapper.find('.feed-leaf__external-resource').children('a').first().prop('href')).toStrictEqual('');
  });
});