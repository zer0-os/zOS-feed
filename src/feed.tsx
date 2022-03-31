import React from 'react';
import { FeedItem, Model as FeedItemModel } from './feed-item';

import './styles.css';

export interface Properties {
  items: FeedItemModel[];
  app: string;
}

export class Feed extends React.Component<Properties> {
  renderItems() {
    const { items, app } = this.props;
    return items.map(item => <FeedItem key={item.id} {...item} app={app} />);
  }

  render() {
    return (
      <div className="feed">
        <div className="feed__items">
          {this.renderItems()}
        </div>
      </div>
    );
  }
}
