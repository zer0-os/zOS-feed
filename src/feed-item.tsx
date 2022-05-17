import React from 'react';
import { Link } from 'react-router-dom';
import Image from './components/image';
import { metadataService } from '@zer0-os/zos-zns';

import './styles.css';

export interface Model {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  znsRoute: string;
  metadataUrl?: string;
}

export interface Properties extends Model {
  app: string;
}

export interface State {
  item: Model;
}

export class FeedItem extends React.Component<Properties> {
  constructor(props) {
    super(props);

    const { app, ...model } = props;

    this.state = {
      ...model
    };
  }
  state = { ...this.props };

  componentDidMount = async () => {
    const { metadataUrl } = this.props;

    if (metadataUrl) {
      const metadata = await metadataService.load(metadataUrl);

      this.setState(previousState => ({ ...previousState, ...metadata }));
    }
  }

  render() {
    const { title, description, imageUrl, znsRoute, app } = this.state;

    return (
      <div className="feed-item">
        <div className="feed-item__text-content">
          <Link to={`/${[znsRoute, app].join("/")}`}>
            <h3 className="feed-item__title">{title}</h3>
          </Link>
          <span className="feed-item__description">{description}</span>
        </div>

        {imageUrl && (
          <Image
            src={imageUrl}
            className="feed-item__image"
            alt={title}
          />
        )}
      </div>
    );
  }
}
