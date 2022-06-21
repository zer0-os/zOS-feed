import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { FeedLeafContainer } from './feed-leaf-container';
import { Model as FeedItem } from './feed-model';
import { isLeafNode } from './util/feed';
import { AsyncActionStatus, load, ZnsRouteRequest, denormalize } from './store/feed';
import { RootState } from './store';
import {Spinner} from '@zer0-os/zos-component-library';

export interface PublicProperties {
  provider: any;
  route: string;
}

export interface Properties extends PublicProperties {
  items: FeedItem[];
  selectedItem: FeedItem;
  status: AsyncActionStatus;
  load: (request: ZnsRouteRequest) => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState): Partial<Properties> {
    return {
      items: denormalize(state, state.feed.value.ids),
      status: state.feed.status,
      selectedItem: state.feed.selectedItem,
    };
  }

  static mapActions(_props: Properties): Partial<Properties> {
    return { load };
  }

  componentDidMount = async () => {
    const { route, provider } = this.props;

    // at this point the assumption is that we're never navigating to the
    // "root", so we only load routes that are a non-empty string.
    if (route) {
      this.props.load({ route, provider });
    }
  }

  componentDidUpdate(prevProps: Properties) {
    const { route, provider } = this.props;

    if (route && (route !== prevProps.route)) {
      this.props.load({ route, provider });
    }
  }

  get isLoading() {
    return this.props.status === AsyncActionStatus.Loading;
  }
  
  render() {
    const { items, route, selectedItem, provider } = this.props;
    
    if (this.isLoading) {
      return (
        <div className='feed-spinner'>
          <Spinner />
          <span className='feed-spinner__text'>Loading Feed</span>
        </div>
      );
    }

    if (isLeafNode(route, items)) {
      return <FeedLeafContainer item={selectedItem} chainId={provider?.network?.chainId} />;
    }

    return <Feed items={items} />;
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
