import React from 'react';
import { FeedItemContainer } from './feed-item-container';
import { Model as FeedItemModel } from './feed-model';
import InfiniteScroll from 'react-infinite-scroll-component';
import isEqualWith from 'lodash.isequalwith';

import './styles.css';
import classNames from 'classnames';
import { Spinner } from '@zer0-os/zos-component-library';
export interface Properties {
  items: FeedItemModel[];
  fetchMoreFeed: (offset: number) => void;
  hasMore: boolean
}

export interface State {
  pageNumber: number;
}

export class Feed extends React.Component<Properties, State> {
  state = { pageNumber: 1 };
  
  fetchMoreData = () => {
    const { pageNumber } = this.state;
    this.props.fetchMoreFeed(pageNumber);
    
    this.setState({
      pageNumber: pageNumber + 1,
    });
  };

  renderItems() {
    return (
      <InfiniteScroll
        dataLength={this.props.items.length}
        next={this.fetchMoreData}
        hasMore={this.props.hasMore}
        initialScrollY={0}
        scrollThreshold='70px'
        loader={<div className='feed-item__spinner'><Spinner /></div>}
        scrollableTarget="feed"
      >
        {this.props.items.map((item) => (
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
