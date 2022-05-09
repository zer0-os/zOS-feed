import React from 'react';
import { FeedItem, Model as FeedItemModel } from './feed-item';
import InfiniteScroll from 'react-infinite-scroll-component';

import './styles.css';

export interface Properties {
  items: FeedItemModel[];
  app: string;
}

export interface State {
  feed: FeedItemModel[];
  hasMore?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export class Feed extends React.Component<Properties, State> {
  componentDidMount() {
    this.setState({ feed: this.props.items.slice(0, 2) });
  }

  componentDidUpdate(prevProps: Properties) {
    const { items } = this.props;
    if (items && items !== prevProps.items) {
      this.setState({ feed: items.slice(0, 2) });
      this.setState({ pageNumber: 2, pageSize: 2, hasMore: true });
    }
  }

  fetchMoreData = () => {
    const { pageNumber, pageSize, feed } = this.state;
    if (feed.length >= this.props.items.length) {
      this.setState({ hasMore: false });
      return;
    }
    setTimeout(() => {
      this.setState({
        feed: feed.concat(
          this.props.items.slice(
            (pageNumber - 1) * pageSize,
            pageNumber * pageSize
          )
        ),
        pageNumber: pageNumber + 1,
      });
    }, 300);
  };

  renderItems() {
    const { app } = this.props;

    return (
      <InfiniteScroll
        dataLength={this.state.feed.length}
        next={this.fetchMoreData}
        hasMore={this.state.hasMore}
        loader={<p></p>}
      >
        {this.state.feed.map((item) => (
          <FeedItem key={item.id} {...item} app={app} />
        ))}
      </InfiniteScroll>
    );
  }

  render() {
    return (
      <div className="feed">
        <div className="feed__items">{this.state && this.renderItems()}</div>
      </div>
    );
  }
}
