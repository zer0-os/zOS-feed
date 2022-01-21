import React from 'react';
import { connectContainer } from './util/redux-container';

import { Feed } from './feed';
import { Model as FeedItem } from './feed-item';
import { load, ZnsRouteRequest } from './store/feed';
import { RootState } from './store';

export interface PublicProperties {
  provider: any;
  route: string;
}

export interface Properties extends PublicProperties {
  items: FeedItem[];
  load: (request: ZnsRouteRequest) => void;
}

export class Container extends React.Component<Properties> {
  static mapState(state: RootState): Partial<Properties> {
    return {
      items: state.feed.value,
    };
  }

  static mapActions(_props: Properties): Partial<Properties> {
    return { load };
  }

  componentDidMount() {
    const { route, provider } = this.props;
    // at this point the assumption is that we're never navigating to the
    // "root", so we only for routes that are a non-empty string.
    if (route) {
      this.props.load({ route, provider });
    }
  }

  componentDidUpdate(prevProps: Properties) {
    const { route, provider } = this.props;

    if (route && ( route !== prevProps.route)) {
      this.props.load({ route, provider });
    }
  }

  render() {
    return <Feed items={this.props.items} />;
  }
}

export const FeedContainer = connectContainer<PublicProperties>(Container);
