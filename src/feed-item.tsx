import React from 'react';
import { ZnsLink } from '@zer0-os/zos-component-library';
import { Model } from './feed-model';
import CloudMedia from './components/cloud-media';

import './styles.css';

export interface Properties {
  app: string;
  item: Model;
}

export class FeedItem extends React.Component<Properties> {
  render() {
    const { app, item } = this.props;
    const { znsRoute, title, description, imageUrl } = item;

    return (
      <div className='feed-item'>
        <ZnsLink route={znsRoute}>
          <div className='feed-item__text-content'>
            <h3 className='feed-item__title'>{title}</h3>
            <span className='feed-item__description'>{description}</span>
          </div>
          <CloudMedia
            className='feed-item__image'
            src={imageUrl}
            alt={title}
            width={424}
            height={424}
          />
        </ZnsLink>
      </div>
    );
  }
}
