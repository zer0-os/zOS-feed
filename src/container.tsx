import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { FeedLeaf } from './feed-leaf';
import { Model as FeedItem } from './feed-model';
import { isLeafNode } from './util/feed';
import { load, ZnsRouteRequest, setSelectedItem, setSelectedItemByRoute } from './store/feed';
import { client } from '@zer0-os/zos-zns';
import { RootState } from './store';
import { metadataService } from '@zer0-os/zos-zns';

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
  selectedItem?: FeedItem;
  load: (request: ZnsRouteRequest) => void;
  setSelectedItem?: any;
  setSelectedItemByRoute?: any;
}

let metadataAbortController = new AbortController();

export class Container extends React.Component<Properties> {
  static mapState(state: RootState): Partial<Properties> {
    return {
      items: state.feed.value,
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
      this.abortMetadataThenLoad(route, provider);
    }
  }

  componentDidUpdate(prevProps: Properties) {
    const { route: { znsRoute: route }, provider } = this.props;

    if (route && (route !== prevProps.route.znsRoute)) {
      this.abortMetadataThenLoad(route, provider);
    }
  }

  abortMetadataThenLoad(route, provider) {
    metadataAbortController.abort();
    metadataAbortController = new AbortController();

    this.props.load({ route, provider });
  }

  render() {
    const { items, route: { app, znsRoute }, setSelectedItem, selectedItem } = this.props;

    const metadataProps = { metadataService: metadataService, metadataAbortController: metadataAbortController };

    return (
      <>
        {isLeafNode(znsRoute, items) &&
          <FeedLeaf item={selectedItem} {...metadataProps} />
        }
        {!isLeafNode(znsRoute, items) &&
          <Feed items={items} app={app} setSelectedItem={setSelectedItem} {...metadataProps} />
        }
      </>
    )
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
