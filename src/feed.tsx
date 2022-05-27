import React from 'react';
import { FeedItem } from './feed-item';
import { Model as FeedItemModel } from './feed-model';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isEqual } from 'lodash';
import { ZnsMetadataService } from '@zer0-os/zos-zns';

import './styles.css';

export interface Properties {
  items: FeedItemModel[];
  app: string;
  metadataService: ZnsMetadataService;
  metadataAbortController: AbortController;
  setSelectedItem: (item: FeedItem) => void;
}

export interface State {
  feed: FeedItemModel[];
  hasMore: boolean;
  pageNumber: number;
}

export class Feed extends React.Component<Properties, State> {
  static pageSize: number = 5;

  constructor(props) {
    super(props);
    this.state = {
      feed: this.props.items.slice(0, Feed.pageSize) || [],
      hasMore: false,
      pageNumber: 1,
    };
  }

  componentDidUpdate(prevProps: Properties) {
    const { items } = this.props;
    if (
      items.length != prevProps.items.length ||
      (items.length == prevProps.items.length &&
        !isEqual(items, prevProps.items))
    ) {
      this.setState({
        feed: items.slice(0, Feed.pageSize),
        hasMore: true,
        pageNumber: 1,
      });
    }
  }

  fetchMoreData = () => {
    const { pageNumber, feed } = this.state;
    if (feed.length >= this.props.items.length) {
      this.setState({ hasMore: false });
      return;
    }

    this.setState({
      feed: feed.concat(
        this.props.items.slice(
          pageNumber * Feed.pageSize,
          (pageNumber + 1) * Feed.pageSize
        )
      ),
      pageNumber: pageNumber + 1,
    });
  };

  renderItems() {
    const { app, setSelectedItem, metadataService, metadataAbortController } = this.props;
    return (
      <InfiniteScroll
        dataLength={this.state.feed.length}
        next={this.fetchMoreData}
        hasMore={this.state.hasMore}
        initialScrollY={0}
        scrollThreshold='0px'
        loader={<></>}
      >
        {this.state.feed.map((item) => (
          <FeedItem key={item.id} item={item} app={app} setSelectedItem={setSelectedItem} metadataService={metadataService} metadataAbortController={metadataAbortController} />
        ))}
      </InfiniteScroll>
    );
  }

  render() {
    return (
      <div className="feed">
        <div className="feed__items">{this.renderItems()}</div>
      </div>
    );
  }
}
