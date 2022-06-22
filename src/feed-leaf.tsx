import React from 'react';
import { shorty } from './util/feed';
import CloudMedia from './components/cloud-media';
import EtherScan from './components/ether-scan';

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
}

export class FeedLeaf extends React.Component<Properties, {}> {
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
    } = this.props;

    return (
      <div className='feed-leaf'>
        <CloudMedia
          className='feed-leaf__image'
          src={animationUrl || imageUrl}
          alt={title}
          width={800}
          height={800}
        />
        <div className='feed-leaf__text-content'>
          <h1 className='feed-leaf__title'>{title}</h1>

          {minter && owner &&
            <div className='feed-leaf__roles'>
              <div className='feed-leaf__role' title={minter}><span>Creator</span><span>{shorty(minter)}</span></div>
              <div className='feed-leaf__role' title={owner}><span>Owner</span><span>{shorty(owner)}</span></div>
            </div>
          }

          <div className='feed-leaf__description'>{description}</div>
        </div>

        {attributes &&
          <>
            <h4 className='feed-leaf__attributes-title'>Attributes</h4>
            <div className='feed-leaf__attributes'>
              {
                attributes.map((attribute, index) => {
                  return (
                    <div className='feed-leaf__attribute' key={index}>
                      <span className='feed-leaf__attribute-name'>{attribute.trait_type}</span>
                      <span className='feed-leaf__attribute-value'>{attribute.value}</span>
                    </div>
                  );
                })
              }
            </div>
          </>
        }

        <div className='feed-leaf__external-resources'>
          <EtherScan
            className='feed-leaf__external-resource'
            domainId={id}
            chainId={chainId}
            znsDomain={contract}
          />
          <div className='feed-leaf__external-resource' title={ipfsContentId}>
            <span>IPFS Hash</span><span>{shorty(ipfsContentId)}</span><a href={metadataUrl} target='_blank'>View on IPFS</a>
          </div>
        </div>
      </div>
    );
  }
}
