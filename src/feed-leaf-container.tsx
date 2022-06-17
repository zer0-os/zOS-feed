import React from 'react';

import { connectContainer } from './util/redux-container';
import { Model } from './feed-model';
import { RootState } from './store';
import { FeedLeaf } from './feed-leaf';
import { loadSelectedItemMetadata } from './store/feed';

export interface PublicProperties {
  item: Model;
  chainId: number;
}

export interface Properties extends PublicProperties {
  item: Model;
  loadSelectedItemMetadata: () => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState, props: Properties): Partial<Properties> {
    const { item, chainId } = props;

    return { item, chainId };
  }

  static mapActions(_props: Properties): Partial<Properties> {
    return { loadSelectedItemMetadata };
  }

  componentDidMount() {
    this.props.loadSelectedItemMetadata();
  }

  componentDidUpdate = async (prevProps: Properties) => {
    const { item } = this.props;

    if (item && (item.id !== prevProps.item?.id)) {
      this.props.loadSelectedItemMetadata();
    }
  }

  render() {
    return (
      <FeedLeaf {...this.props.item} chainId={this.props.chainId} />
    );
  }
}

export const FeedLeafContainer = connectContainer<PublicProperties>(Container);
