import React from 'react';
import { shallow } from 'enzyme';

import { FeedFilters } from './feed-filters';

describe('FeedFilters', () => {
  const subject = (props: any = {}) => {
    return shallow(<FeedFilters {...props} />);
  };

  it('renders default filter', () => {
    const wrapper = subject();

    const filterName = wrapper.find('.feed-filters__filter-name').at(0).text().trim();

    expect(filterName).toBe('Everything');
  });

  it('renders filter in filters section', () => {
    const wrapper = subject();

    const section = wrapper.find('section.feed-filters__filters');

    expect(section.find('.feed-filters__filter').exists()).toBe(true);
  });

  it('renders section header', () => {
    const wrapper = subject();

    const headerText = wrapper.find('.feed-filters__filters .feed-filters__section-header').text().trim();

    expect(headerText).toBe('Filters');
  });
});
