import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { Model as FeedItem } from './feed-item';
import { AsyncActionStatus, load, ZnsRouteRequest } from './store/feed';
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
  status: AsyncActionStatus;
  load: (request: ZnsRouteRequest) => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState): Partial<Properties> {
    return {
      items: state.feed.value,
      status: state.feed.status,
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
    const { items, route: { app }, status } = this.props;

    return <Feed items={items} app={app} isLoading={status === AsyncActionStatus.Loading}/>;
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
