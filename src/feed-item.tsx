import React from 'react';
import { Link } from 'react-router-dom';
import Image from './components/image';
import { ZnsMetadataService } from '@zer0-os/zos-zns';
import { augmentWithMetadata } from './util/feed';
import { Model } from './feed-model';

import './styles.css';

export interface Properties {
  item: Model;
  app: string;
  metadataService?: ZnsMetadataService;
  metadataAbortController?: any;
  setSelectedItem?: any;
}

interface State {
  item: Model;
}

export class FeedItem extends React.Component<Properties, State> {
  state = { item: this.props.item };

  componentDidMount = async () => {
    const { item, metadataService, metadataAbortController } = this.props;

    this.setState({ item: await augmentWithMetadata(item, metadataService, metadataAbortController) });
  }

  onClick = () => {
    const { item } = this.state;

    this.props.setSelectedItem(item);
  }

  render() {
    const { item: { title, description, imageUrl, znsRoute } } = this.state;
    const { app } = this.props;

    return (
      <div className="feed-item">
        <Link to={`/${[znsRoute, app].join("/")}`} onClick={this.onClick}>
          <div className="feed-item__text-content">
            <h3 className="feed-item__title">{title}</h3>
            <span className="feed-item__description">{description}</span>
          </div>
          <Image
            className="feed-item__image"
            src={imageUrl}
            alt={title}
          />
        </Link>
      </div>
    );
  }
}
