import React from 'react';
import { ZnsLink } from '@zer0-os/zos-component-library';
import CloudMedia from './components/cloud-media';

import './styles.css';

export interface Properties {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  animationUrl?: string;
  znsRoute: string;
}

export class FeedItem extends React.Component<Properties> {
  render() {
    const { znsRoute, title, description, imageUrl, animationUrl } = this.props;

    return (
      <div className='feed-item'>
        <ZnsLink route={znsRoute}>
          <div className='feed-item__text-content'>
            <h3 className='feed-item__title'>{title}</h3>
            <span className='feed-item__description'>{description}</span>
          </div>
          <CloudMedia
            className='feed-item__image'
            src={animationUrl || imageUrl}
            alt={title}
            width={504}
          />
        </ZnsLink>
      </div>
    );
  }
}
