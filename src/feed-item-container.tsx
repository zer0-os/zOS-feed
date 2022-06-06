import React from 'react';

import { connectContainer } from './util/redux-container';
import { Model as FeedItemModel, Model } from './feed-model';
import { RootState } from './store';
import { FeedItem } from './feed-item';
import { loadItem } from './store/feed';

export interface PublicProperties {
  id: string;
  app: string;
  setSelectedItem: (item: Model) => void;
}

export interface Properties extends PublicProperties {
  item: FeedItemModel;
  load: (id: string) => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState, props: Properties): Partial<Properties> {
    const item = state.feed.value.find((item) => item.id === props.id);

    return { item };
  }

  static mapActions(_props: Properties): Partial<Properties> {
    return { load: loadItem };
  }

  componentDidMount() {
    this.props.load(this.props.id);
  }

  render() {
    return (
      <FeedItem
        app={this.props.app}
        setSelectedItem={this.props.setSelectedItem}
        {...this.props.item}
      />
    );
  }
}

export const FeedItemContainer = connectContainer<PublicProperties>(Container);
