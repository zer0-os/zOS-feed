import React from 'react';
import { shorty } from './util/feed';
import EtherScan from './components/ether-scan';
import { IpfsMedia } from '@zero-tech/zapp-utils/components';

import './styles.css';
export interface Properties {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  animationUrl?: string;
  minter?: string;
  owner?: string;
  attributes?: { trait_type: string, value: string }[];
  ipfsContentId: string;
  metadataUrl: string;
  chainId: number;
  contract: string;
  znsRoute: string;
}

export class FeedLeaf extends React.Component<Properties, {}> {
  onCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  getTwitterLink = (): string => {
    const { znsRoute } = this.props;
    if (znsRoute && !znsRoute.startsWith('wilder.')) {
      return '/';
    }

    return (
      'https://twitter.com/intent/tweet?url=https://share.market.wilderworld.com/' +
      znsRoute?.split('wilder.')[1]
    );
  };

  render() {
    const {
      title,
      description,
      imageUrl,
      animationUrl,
      minter,
      owner,
      attributes,
      ipfsContentId,
      id,
      metadataUrl,
      chainId,
      contract,
      znsRoute,
    } = this.props;

    return (
      <div className='feed-leaf'>
        <IpfsMedia
          alt={title}
          className='feed-leaf__image'
          src={animationUrl || imageUrl}
        />
        <div className='feed-leaf__text-content'>
          <h1 className='feed-leaf__title'>{title}</h1>

          <div className='feed-leaf__roles'>
            {minter && owner && (
              <div className='feed-leaf__members'>
                <div className='feed-leaf__member' title={minter}>
                  <span>Creator</span>
                  <span>{shorty(minter)}</span>
                </div>
                <div className='feed-leaf__member' title={owner}>
                  <span>Owner</span>
                  <span>{shorty(owner)}</span>
                </div>
              </div>
            )}
            {znsRoute && (
              <div className='feed-leaf__shares'>
                <a
                  href={this.getTwitterLink()}
                  className='feed-leaf__share'
                  target='_blank'
                  rel='noopener,noreferrer'
                ></a>
              </div>
            )}
          </div>

          <div className='feed-leaf__description'>{description}</div>
        </div>

        {attributes && (
          <>
            <h4 className='feed-leaf__attributes-title'>Attributes</h4>
            <div className='feed-leaf__attributes'>
              {attributes.map((attribute, index) => {
                return (
                  <div className='feed-leaf__attribute' key={index}>
                    <span className='feed-leaf__attribute-name'>
                      {attribute.trait_type}
                    </span>
                    <span className='feed-leaf__attribute-value'>
                      {attribute.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className='feed-leaf__external-resources'>
          <EtherScan
            className='feed-leaf__external-resource'
            domainId={id}
            chainId={chainId}
            znsDomain={contract}
          />
          <div className='feed-leaf__external-resource' title={ipfsContentId}>
            <div className='details'>
              <span>IPFS Hash</span>
              <span>{shorty(ipfsContentId)}</span>
              <a href={metadataUrl} target='_blank'>
                View on IPFS
              </a>
            </div>
            <button
              className='feed-leaf__copy'
              onClick={() => this.onCopy(ipfsContentId)}
            >
              &nbsp;
            </button>
          </div>
        </div>
      </div>
    );
  }
}
