import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { FeedLeafContainer } from './feed-leaf-container';
import { Model as FeedItem } from './feed-model';
import { isLeafNode } from './util/feed';
import { AsyncActionStatus, load, ZnsRouteRequest, setSelectedItem, setSelectedItemByRoute } from './store/feed';
import { client } from '@zer0-os/zos-zns';
import { RootState } from './store';

interface Route {
  znsRoute: string;
  app: string;
}

export interface PublicProperties {
  provider: any;
  route: Route;
}

export interface Properties extends PublicProperties {
  items: FeedItem[];
  selectedItem: FeedItem;
  status: AsyncActionStatus;
  load: (request: ZnsRouteRequest) => void;
  setSelectedItem: (item: FeedItem) => void;
  setSelectedItemByRoute: (request: ZnsRouteRequest) => void;
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
    return { load, setSelectedItem, setSelectedItemByRoute };
  }

  componentDidMount = async () => {
    const { items, route: { znsRoute: route }, provider } = this.props;

    if (isLeafNode(route, items)) {
      this.props.setSelectedItemByRoute({ route, provider });
    }
    else {
      this.props.load({ route, provider });
    }
  }

  componentDidUpdate(prevProps: Properties) {
    const { items, route: { znsRoute: route }, provider } = this.props;

    if (route && (route !== prevProps.route.znsRoute)) {
      if (isLeafNode(route, items)) {
        this.props.setSelectedItemByRoute({ route, provider });
      }
      else {
        this.props.load({ route, provider });
      }
    }
  }
  
  render() {
    const { items, route: { app, znsRoute }, status, setSelectedItem, selectedItem, provider } = this.props;
    
    return (
      <>
        {isLeafNode(znsRoute, items) &&
          <FeedLeafContainer item={selectedItem} chainId={provider?.network?.chainId} />
        }
        {!isLeafNode(znsRoute, items) &&
          <Feed items={items} app={app} isLoading={status === AsyncActionStatus.Loading} setSelectedItem={setSelectedItem} />
        }
      </>
    )
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
