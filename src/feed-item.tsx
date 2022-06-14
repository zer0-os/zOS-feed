import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from './feed-model';
import CloudMedia from './components/cloud-media';

import './styles.css';

export interface Properties {
  app: string;
  item: Model;
  setSelectedItem: (item: Model) => void;
}

export class FeedItem extends React.Component<Properties> {
  onClick = () => {
    this.props.setSelectedItem(this.props.item);
  }

  render() {
    const { app, item } = this.props;
    const { znsRoute, title, description, imageUrl } = item;

    return (
      <div className='feed-item'>
        <Link to={`/${[znsRoute, app].join('/')}`} onClick={this.onClick}>
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
        </Link>
      </div>
    );
  }
}
