import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { client } from '@zer0-os/zos-zns';

import { load } from './saga';
import { AsyncActionStatus, reducer } from './store';

describe('feed saga', () => {
  const getZnsClient = (overrides = {}) => {
    return {
      getFeed: async () => [],
      resolveIdFromName: () => '',
      ...overrides,
    };
  };

  it('should pass current provider to zns client', async () => {
    const provider = { networkId: 7 };

    await expectSaga(load, { payload: { route: '', provider } })
      .provide([
        [matchers.call.fn(client.get), getZnsClient()],
      ])
      .call(client.get, provider)
      .run();
  });

  it('should get feed for provided payload', async () => {
    const znsClient = getZnsClient();

    await expectSaga(load, { payload: { route: 'theroute', provider: {} } })
      .provide([
        [matchers.call.fn(client.get), znsClient],
        [matchers.call([znsClient, znsClient.resolveIdFromName], 'theroute'), 'the-id'],
        [matchers.call.fn(znsClient.getFeed), []],
      ])
      .call([znsClient, znsClient.getFeed], 'the-id')
      .run();
  });

  it('should set feed data in store from zns client', async () => {
    const items = [{
      id: 'the-first-id',
      title: 'The First ZNS Feed Item',
      description: 'This is the description of the first item.',
    }, {
      id: 'the-second-id',
      title: 'The Second ZNS Feed Item',
      description: 'This is the description of the Second item.',
    }, {
      id: 'the-third-id',
      title: 'The Third ZNS Feed Item',
      description: 'This is the description of the Third item.',
    }, {
      id: 'the-fourth-id',
      title: 'The Fourth ZNS Feed Item',
      description: 'This is the description of the Fourth item.',
    }];

    const znsClient = getZnsClient({
      getFeed: async () => items,
    });

    await expectSaga(load, { payload: { route: '', provider: {} } })
      .withReducer(reducer)
      .provide([
        [matchers.call.fn(client.get), znsClient],
      ])
      .hasFinalState({ value: items, status: AsyncActionStatus.Idle })
      .run();
  });
});
