import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { Model as FeedItemModel, FeedItem } from './feed-item';
import { load, ZnsRouteRequest } from './store/feed';
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
  items: FeedItemModel[];
  selectedItem: FeedItemModel;
  load: (request: ZnsRouteRequest) => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState): Partial<Properties> {
    return {
      items: state.feed.value,
      selectedItem: state.feed.selectedItem,
    };
  }

  static mapActions(_props: Properties): Partial<Properties> {
    return { load };
  }

  componentDidMount() {
    const { route: { znsRoute: route }, provider } = this.props;
    // at this point the assumption is that we're never navigating to the
    // "root", so we only for routes that are a non-empty string.
    if (route) {
      this.props.load({ route, provider });
    }
  }

  componentDidUpdate(prevProps: Properties) {
    const { route: { znsRoute }, provider } = this.props;

    if (znsRoute && (znsRoute !== prevProps.route.znsRoute)) {
      this.props.load({ route: znsRoute, provider });
    }
  }

  render() {
    const { items, selectedItem, route: { app }} = this.props;
    
    return(
      <>
        {!selectedItem && items &&
          <Feed items={items} app={app} />
        }
        {selectedItem &&
          <FeedItem {...selectedItem} app={app} />
        }
      </>
  );
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
