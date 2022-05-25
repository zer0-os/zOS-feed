import React from 'react';
import Image from './components/image';
import { ZnsMetadataService } from '@zer0-os/zos-zns';
import { fetchMetadata } from './util/feed';
import { Model } from './feed-model';

import './styles.css';

export interface Properties {
  item: Model;
  metadataService?: ZnsMetadataService;
  metadataAbortController?: any;
}

interface State {
  item: Model;
}

export class FeedLeaf extends React.Component<Properties, State> {
  state = { item: this.props.item };

  componentDidMount = async () => {
    const { item: { metadataUrl }, metadataService, metadataAbortController } = this.props;

    this.updateItem(await fetchMetadata(metadataUrl, metadataService, metadataAbortController));
  }

  updateItem(metadata) {
    const { item } = this.state;

    this.setState({ item: { ...item, ...metadata } });
  }

  render() {
    console.log('render props', this.props, 'state', this.state)
    const { item: { title, description, imageUrl } } = this.state || { item: { title: '', description: '', imageUrl: undefined } };

    return (
      <div className="feed-leaf">

        <h1>Feed Leaf</h1><h1>Feed Leaf</h1><h1>Feed Leaf</h1>
        <div className="feed-item__text-content">
          <h3 className="feed-item__title">{title}</h3>
          <span className="feed-item__description">{description}</span>
        </div>
        <Image
          className="feed-item__image"
          src={imageUrl}
          alt={title}
        />
      </div>
    );
  }
}
