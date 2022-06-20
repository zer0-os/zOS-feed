import React from 'react';

import { connectContainer } from './util/redux-container';
import { Model as FeedItemModel } from './feed-model';
import { RootState } from './store';
import { FeedItem } from './feed-item';
import { loadItemMetadata } from './store/feed';

export interface PublicProperties {
  id: string;
}

export interface Properties extends PublicProperties {
  item: FeedItemModel;
  loadItemMetadata: (id: string) => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState, props: Properties): Partial<Properties> {
    const item = state.feed.value.find((item) => item.id === props.id);

    return { item };
  }

  static mapActions(_props: Properties): Partial<Properties> {
    return { loadItemMetadata };
  }

  componentDidMount() {
    this.props.loadItemMetadata(this.props.id);
  }

  render() {
    const { id, item: { title, description, imageUrl, znsRoute } } = this.props;

    return (
      <FeedItem
        id={id}
        title={title}
        description={description}
        imageUrl={imageUrl}
        znsRoute={znsRoute}
      />
    );
  }
}

export const FeedItemContainer = connectContainer<PublicProperties>(Container);
