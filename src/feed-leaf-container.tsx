import React from 'react';

import { connectContainer } from './util/redux-container';
import { Model } from './feed-model';
import { RootState } from './store';
import { FeedLeaf } from './feed-leaf';
import { denormalize, loadItemMetadata } from './store/feed';

export interface PublicProperties {
  chainId: number;
}

export interface Properties extends PublicProperties {
  item: Model;
  loadMetadata: (id: string) => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState): Partial<Properties> {
    const item = denormalize(state, state.feed.selectedItem);

    return { item };
  }

  static mapActions(_props: Properties): Partial<Properties> {
    return {
      loadMetadata: loadItemMetadata,
    };
  }

  shareNFT = (): void => {console.log('clickeeeeeed ----')
    const { znsRoute } = this.props.item;

    window.open(
      'https://twitter.com/intent/tweet?url=https://share.market.wilderworld.com/' +
        znsRoute?.split('wilder.')[1],
      '_blank',
      'noopener,noreferrer'
    );
  };

  componentDidMount() {
    const { item } = this.props;

    if (item && item.id) {
      this.props.loadMetadata(item.id);
    }
  }

  componentDidUpdate = async (prevProps: Properties) => {
    const { item } = this.props;

    if (item && item.id !== prevProps.item?.id) {
      this.props.loadMetadata(item.id);
    }
  };

  render() {
    return (
      <FeedLeaf
        {...this.props.item}
        chainId={this.props.chainId}
        shareNFT={this.shareNFT}
      />
    );
  }
}

export const FeedLeafContainer = connectContainer<PublicProperties>(Container);
