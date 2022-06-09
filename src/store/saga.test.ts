import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { client, metadataService } from '@zer0-os/zos-zns';

import { load, loadItemMetadata, loadSelectedItemMetadata, setSelectedItem, setSelectedItemByRoute } from './saga';
import { AsyncActionStatus, reducer } from './feed';
import { rootReducer } from '.';

describe('feed saga', () => {
  describe('loadItemMetadata', () => {
    it('should load metadata for item', async () => {
      const metadataUrl = 'the-metadata-url';

      const initialState = {
        feed: { value: [ { id: 'the-item-id', metadataUrl } ] },
      };

      await expectSaga(loadItemMetadata, { payload: 'the-item-id' })
        .withState(initialState)
        .provide([[matchers.call.fn(metadataService.load), {}]])
        .call(metadataService.load, metadataUrl)
        .run();
    });

    it('should update item in state with metadata', async () => {
      const metadataUrl = 'the-second-metadata-url';

      const metadata = {
        name: 'name from metadata',
        description: 'description from metadata',
        attributes: [
          { trait_type: 'color', value: 'red' },
        ],
      };

      const initialState = {
        feed: {
          value: [
            { id: 'the-first-item-id', metadataUrl: 'first-metadata-url', name: 'cats', description: 'what' },
            { id: 'the-second-item-id', metadataUrl, name: 'dogs', description: 'heyo' },
          ]
        },
      };

      const { storeState: { feed: { value: [, finalItem] } } } = await expectSaga(loadItemMetadata, { payload: 'the-second-item-id' })
        .withReducer(rootReducer, initialState)
        .provide([
          [matchers.call(metadataService.load, metadataUrl), metadata],
        ])
        .call(metadataService.load, metadataUrl)
        .run();

      expect(finalItem).toMatchObject({
        id: 'the-second-item-id',
        metadataUrl,
        name: 'name from metadata',
        description: 'description from metadata',
        attributes: [
          { trait_type: 'color', value: 'red' },
        ],
      });
    });
  });

  describe('loadSelectedItemMetadata', () => {
    it('should load metadata for item', async () => {
      const metadataUrl = 'the-metadata-url';

      const initialState = {
        feed: { selectedItem: { id: 'the-item-id', metadataUrl } },
      };

      await expectSaga(loadSelectedItemMetadata)
        .withState(initialState)
        .provide([[matchers.call.fn(metadataService.load), {}]])
        .call(metadataService.load, metadataUrl)
        .run();
    });

    it('should update item in state with metadata', async () => {
      const metadataUrl = 'the-second-metadata-url';

      const metadata = {
        name: 'name from metadata',
        description: 'description from metadata',
        attributes: [
          { trait_type: 'color', value: 'red' },
        ],
      };

      const initialState = {
        feed: {
          selectedItem: { id: 'the-first-item-id', metadataUrl, name: 'cats', description: 'what' },
        },
      };

      const { storeState: { feed: { selectedItem: finalItem } } } = await expectSaga(loadSelectedItemMetadata)
        .withReducer(rootReducer, initialState)
        .provide([
          [matchers.call(metadataService.load, metadataUrl), metadata],
        ])
        .call(metadataService.load, metadataUrl)
        .run();

      expect(finalItem).toMatchObject({
        id: 'the-first-item-id',
        metadataUrl,
        name: 'name from metadata',
        description: 'description from metadata',
        attributes: [
          { trait_type: 'color', value: 'red' },
        ],
      });
    });
  });

  describe('load', () => {
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
        .provide([[matchers.call.fn(client.get), getZnsClient()]])
        .call(client.get, provider)
        .run();
    });

    it('should get feed for provided payload', async () => {
      const znsClient = getZnsClient();

      await expectSaga(load, { payload: { route: 'theroute', provider: {} } })
        .provide([
          [matchers.call.fn(client.get), znsClient],
          [
            matchers.call([znsClient, znsClient.resolveIdFromName], 'theroute'),
            'the-id',
          ],
          [matchers.call.fn(znsClient.getFeed), []],
        ])
        .call([znsClient, znsClient.getFeed], 'the-id')
        .run();
    });

    it('should set feed data in store from zns client', async () => {
      const items = [
        {
          id: 'the-first-id',
          title: 'The First ZNS Feed Item',
          description: 'This is the description of the first item.',
        },
        {
          id: 'the-second-id',
          title: 'The Second ZNS Feed Item',
          description: 'This is the description of the Second item.',
        },
        {
          id: 'the-third-id',
          title: 'The Third ZNS Feed Item',
          description: 'This is the description of the Third item.',
        },
        {
          id: 'the-fourth-id',
          title: 'The Fourth ZNS Feed Item',
          description: 'This is the description of the Fourth item.',
        },
      ];

      const znsClient = getZnsClient({
        getFeed: async () => items,
      });

      await expectSaga(load, { payload: { route: '', provider: {} } })
        .withReducer(reducer)
        .provide([
          [matchers.call.fn(client.get), znsClient],
        ])
        .hasFinalState({ value: items, status: AsyncActionStatus.Idle, selectedItem: undefined, })
        .run();
    });

    it('should set status to failed on case of an error', async () => {
      const error = new Error('error');

      await expectSaga(load, { payload: { route: '', provider: {} } })
        .provide([[matchers.call.fn(client.get), throwError(error)]])
        .put({
          type: 'feed/setStatus',
          payload: AsyncActionStatus.Loading,
        })
        .put({
          type: 'feed/setStatus',
          payload: AsyncActionStatus.Failed,
        })
        .run();
    });
  });

  it('should set feed item in store from zns client when setSelectedItemByRoute', async () => {
    const item = {
      id: 'the-first-id',
      title: 'The First ZNS Feed Item',
      description: 'This is the description of the first item.',
    };

    const znsClient = getZnsClient({
      getFeedItem: async () => item,
    });

    await expectSaga(setSelectedItemByRoute, { payload: { route: '', provider: {} } })
      .withReducer(reducer)
      .provide([
        [matchers.call.fn(client.get), znsClient],
      ])
      .hasFinalState({ value: [], status: AsyncActionStatus.Idle, selectedItem: item, })
      .run();
  });

  const getZnsClient = (overrides = {}) => {
    return {
      getFeed: async () => [],
      resolveIdFromName: () => '',
      ...overrides,
    };
  };

  it('should set feed item in store from zns client when setSelectedItem', async () => {
    const item = {
      id: 'the-first-id',
      title: 'The First ZNS Feed Item',
      description: 'This is the description of the first item.',
    };

    const znsClient = getZnsClient({
      getFeedItem: async () => item,
    });

    await expectSaga(setSelectedItem, { payload: item })
      .withReducer(reducer)
      .provide([
        [matchers.call.fn(client.get), znsClient],
      ])
      .hasFinalState({ value: [], status: AsyncActionStatus.Idle, selectedItem: item, })
      .run();
  });

  it('should set feed item in store from zns client when setSelectedItem', async () => {
    const item = {
      id: 'the-first-id',
      title: 'The First ZNS Feed Item',
      description: 'This is the description of the first item.',
    };

    const znsClient = getZnsClient({
      getFeedItem: async () => item,
    });

    await expectSaga(setSelectedItem, { payload: item })
      .withReducer(reducer)
      .provide([
        [matchers.call.fn(client.get), znsClient],
      ])
      .hasFinalState({ value: [], status: AsyncActionStatus.Idle, selectedItem: item, })
      .run();
  });
});
