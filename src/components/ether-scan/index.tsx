import React, { ImgHTMLAttributes } from 'react';
import { etherscanLink, shorty } from '../../util/feed';

export interface Properties {
  className: string;
  domainId: string;
  chainId: number;
  znsDomain: string;
}

export default class EtherScan extends React.Component<Properties> {
  onCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
  }

  getEtherscanLink(): string {
    const { domainId, chainId, znsDomain } = this.props;
    return etherscanLink(domainId, chainId, znsDomain);
  }

  render() {
    const { className, domainId } = this.props;

    return (
      <div className={className} title={domainId}>
        <div className="details">
          <span>Token Id</span>
          <span>{shorty(domainId)}</span>
          <a href={this.getEtherscanLink()} target='_blank'>
            View on Etherscan
          </a>
        </div>
        <button
          className='feed-leaf__copy'
          onClick={() => this.onCopy(domainId)}
        >
          &nbsp;
        </button>
      </div>
    );
  }
}
