import React from 'react';
import { FeedItemContainer } from './feed-item-container';
import { Model as FeedItemModel } from './feed-model';
import InfiniteScroll from 'react-infinite-scroll-component';
import isEqualWith from 'lodash.isequalwith';

import './styles.css';

export interface Properties {
  items: FeedItemModel[];
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

    this.state = this.getDefaultState(props);
  }

  getDefaultState(props = this.props) {
    const feed = (props.items || []).slice(0, Feed.pageSize);

    return {
      feed,
      hasMore: props.items.length > feed.length,
      pageNumber: 1,
    };
  }

  componentDidUpdate(prevProps) {
    const { items } = this.props;
    const { items: prevItems } = prevProps;

    // this is overly simplified. if we need it to be more complex,
    // we should pull the paging out into global state so that we
    // can be more explicit with when and how to update.
    if (this.haveItemsUpdated(items, prevItems)) {
      this.setState(this.getDefaultState());
    }
  }

  haveItemsUpdated(items, prevItems) {
    if (items.length != prevItems.length) return true;

    return !isEqualWith(
      items,
      prevItems,
      (first, second) => first.id === second.id
    );
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
    return (
      <InfiniteScroll
        dataLength={this.state.feed.length}
        next={this.fetchMoreData}
        hasMore={this.state.hasMore}
        initialScrollY={0}
        scrollThreshold='0px'
        loader={<></>}
        scrollableTarget="feed"
      >
        {this.state.feed.map((item) => (
          <FeedItemContainer key={item.id} id={item.id} />
        ))}
      </InfiniteScroll>
    );
  }

  render() {
    return (
      <div className='feed' id='feed'>
        <div className='feed__items'>{this.renderItems()}</div>
      </div>
    );
  }
}
