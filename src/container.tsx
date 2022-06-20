import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { FeedLeafContainer } from './feed-leaf-container';
import { Model as FeedItem } from './feed-model';
import { isLeafNode } from './util/feed';
import { AsyncActionStatus, load, ZnsRouteRequest } from './store/feed';
import { RootState } from './store';

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
      items: state.feed.value,
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
  
  render() {
    const { items, route, status, selectedItem, provider } = this.props;
    
    return (
      <>
        {isLeafNode(route, items) &&
          <FeedLeafContainer item={selectedItem} chainId={provider?.network?.chainId} />
        }
        {!isLeafNode(route, items) &&
          <Feed items={items} isLoading={status === AsyncActionStatus.Loading} />
        }
      </>
    )
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
