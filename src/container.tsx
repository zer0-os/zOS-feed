import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { FeedLeaf } from './feed-leaf';
import { Model as FeedItem } from './feed-model';
import { load, ZnsRouteRequest, setSelectedItem } from './store/feed';
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
    return { load, setSelectedItem };
  }

  componentDidMount = async () => {
    const { items, route: { znsRoute }, provider } = this.props;

    console.log('componentDidMount, isLeaf', this.isLeafNode(znsRoute, items));
    if (this.isLeafNode(znsRoute, items)) {
      const znsClient = await client.get(this.props.provider);
      const result = await znsClient.getFeedItemByName(znsRoute);
      this.props.setSelectedItem(result);
    }
    else {
      this.abortMetadataThenLoad(znsRoute, provider);
    }
  }

  componentDidUpdate(prevProps: Properties) {
    const { route: { znsRoute }, provider } = this.props;

    if (znsRoute && (znsRoute !== prevProps.route.znsRoute)) {
      this.abortMetadataThenLoad(znsRoute, provider);
    }
  }

  abortMetadataThenLoad(znsRoute, provider) {
    metadataAbortController.abort();
    metadataAbortController = new AbortController();

    this.props.load({ route: znsRoute, provider });
  }

  isLeafNode(znsRoute, items) {
    return znsRoute.includes('.') && items && items.length === 0
  }

  render() {
    const { items, route: { app, znsRoute }, setSelectedItem, selectedItem } = this.props;
    console.log('props', this.props);

    const metadataProps = { metadataService: metadataService, metadataAbortController: metadataAbortController };

    const isLeafNode = this.isLeafNode(znsRoute, items);

    return (
      <>
        {false && isLeafNode &&
          <FeedLeaf item={selectedItem} {...metadataProps} />
        }
        {!isLeafNode &&
          <Feed items={items} app={app} setSelectedItem={setSelectedItem} {...metadataProps} />
        }
      </>
    )
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
