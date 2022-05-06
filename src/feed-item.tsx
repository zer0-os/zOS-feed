import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundImage from './components/background-image'

import './styles.css';

export interface Model {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  znsRoute: string;
}

export interface Properties extends Model {
  app: string;
}

export class FeedItem extends React.Component<Properties> {
  render() {
    const { title, description, imageUrl, znsRoute, app } = this.props;

    return (
      <div className="feed-item">
        <div className='feed-item__text-content'>
          <Link to={`/${[znsRoute, app].join('/')}`}>
            <h3 className="feed-item__title">{title}</h3>
          </Link>
          <span className="feed-item__description">{description}</span>
        </div>

        {imageUrl && (
          <BackgroundImage sourceUrl={imageUrl} classImage="feed-item__image" title={title} />
        )}
        
      </div>
    );
  }
}
