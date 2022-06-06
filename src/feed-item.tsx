import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from './feed-model';
import CloudImage from './components/cloud-image';

import './styles.css';

export interface Properties {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  znsRoute;
  app: string;
  setSelectedItem: (item: Model) => void;
}

export class FeedItem extends React.Component<Properties> {
  onClick = () => {
    this.props.setSelectedItem(this.item);
  }

  get item() {
    const {
      id,
      title,
      description,
      imageUrl,
      znsRoute,
    } = this.props;

    return {
      id,
      title,
      description,
      imageUrl,
      znsRoute,
    };
  }

  render() {
    const { app } = this.props;

    return (
      <div className='feed-item'>
        <Link to={`/${[this.props.znsRoute, app].join('/')}`} onClick={this.onClick}>
          <div className='feed-item__text-content'>
            <h3 className='feed-item__title'>{this.props.title}</h3>
            <span className='feed-item__description'>{this.props.description}</span>
          </div>
          <CloudImage
            className='feed-item__image'
            src={this.props.imageUrl}
            alt={this.props.title}
            width={480}
          />
        </Link>
      </div>
    );
  }
}
