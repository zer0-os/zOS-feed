import React from 'react';
import { ZnsMetadataService } from '@zer0-os/zos-zns';
import { shorty } from './util/feed';
import { Model } from './feed-model';
import CloudImage from './components/cloud-image';

import './styles.css';

export interface Properties extends Model {}

export class FeedLeaf extends React.Component<Properties, {}> {
  render() {
    const { title, description, imageUrl, minter, owner, attributes, ipfsContentId, id, metadataUrl } = this.props;
    
    return (
      <div className='feed-leaf'>
        <CloudImage
          className='feed-leaf__image'
          src={imageUrl}
          alt={title}
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
          <div className='feed-leaf__external-resource' title={id}>
            <span>Token Id</span><span>{shorty(id)}</span>
            <a href='' target='_blank'>View on Etherscan</a>
          </div>
          <div className='feed-leaf__external-resource' title={ipfsContentId}>
            <span>IPFS Hash</span><span>{shorty(ipfsContentId)}</span><a href={metadataUrl} target='_blank'>View on IPFS</a>
          </div>
        </div>
      </div>
    );
  }
}
