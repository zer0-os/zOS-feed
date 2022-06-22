import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { client, metadataService } from '@zer0-os/zos-zns';

import { load, loadItemMetadata } from './saga';
import { AsyncActionStatus, reducer } from './feed';
import { rootReducer } from '.';

describe('feed saga', () => {
  describe('loadItemMetadata', () => {
    it('should load metadata for item', async () => {
      const metadataUrl = 'the-metadata-url';

      const initialState = {
        feed: { value: { entities: { 'the-item-id': { id: 'the-item-id', metadataUrl } } } },
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
          value: {
            ids: ['the-first-item-id', 'the-second-item-id'],
            entities: {
              'the-first-item-id': { id: 'the-first-item-id', metadataUrl: 'first-metadata-url', name: 'cats', description: 'what' },
              'the-second-item-id': { id: 'the-second-item-id', metadataUrl, name: 'dogs', description: 'heyo' },
            },
          },
        },
      } as any;

      const { storeState: { feed: { value: { entities } } } } = await expectSaga(loadItemMetadata, { payload: 'the-second-item-id' })
        .withReducer(rootReducer, initialState)
        .provide([
          [matchers.call(metadataService.load, metadataUrl), metadata],
        ])
        .call(metadataService.load, metadataUrl)
        .run();

      expect(entities['the-second-item-id']).toMatchObject({
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

  describe('load', () => {
    it('should pass current provider to zns client', async () => {
      const provider = { networkId: 7 };

      await expectSaga(load, { payload: { route: '', provider } })
        .provide([[matchers.call.fn(client.get), getZnsClient()]])
        .call(client.get, provider)
        .run();
    });

    it('should get feed and item for provided payload', async () => {
      const znsClient = getZnsClient();

      await expectSaga(load, { payload: { route: 'theroute', provider: {} } })
        .provide([
          [ matchers.call.fn(client.get), znsClient ],
          [ matchers.call([znsClient, znsClient.resolveIdFromName], 'theroute'), 'the-id' ],
          [ matchers.call.fn(znsClient.getFeed), [] ],
          [ matchers.call.fn(znsClient.getFeedItem), [] ],
        ])
        .call([znsClient, znsClient.getFeed], 'the-id')
        .call([znsClient, znsClient.getFeedItem], 'the-id')
        .run();
    });

    it('should set feed children in store from zns client', async () => {
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

      const expectedValue = {
        ids: ['the-first-id', 'the-second-id', 'the-third-id', 'the-fourth-id', ],
        entities: {
          'the-first-id': {
            id: 'the-first-id',
            title: 'The First ZNS Feed Item',
            description: 'This is the description of the first item.',
          },
          'the-second-id': {
            id: 'the-second-id',
            title: 'The Second ZNS Feed Item',
            description: 'This is the description of the Second item.',
          },
          'the-third-id': {
            id: 'the-third-id',
            title: 'The Third ZNS Feed Item',
            description: 'This is the description of the Third item.',
          },
          'the-fourth-id': {
            id: 'the-fourth-id',
            title: 'The Fourth ZNS Feed Item',
            description: 'This is the description of the Fourth item.',
          },
          'the-current-item-id': {
            id: 'the-current-item-id',
          },
        },
      };

      const znsClient = getZnsClient({
        getFeed: async () => items,
        getFeedItem: async () => ({ id: 'the-current-item-id' }),
      });

      await expectSaga(load, { payload: { route: '', provider: {} } })
        .withReducer(reducer)
        .provide([
          [matchers.call.fn(client.get), znsClient],
        ])
        .hasFinalState({
          value: expectedValue,
          status: AsyncActionStatus.Idle,
          selectedItem: 'the-current-item-id',
        })
        .run();
    });

    it('should set feed item data in store from zns client', async () => {
      const item = {
        id: 'the-id',
        title: 'The ZNS Feed Item',
        description: 'This is the description of the item.',
      };

      const znsClient = getZnsClient({
        getFeedItem: async () => item,
      });

      await expectSaga(load, { payload: { route: '', provider: {} } })
        .withReducer(reducer)
        .provide([
          [matchers.call.fn(client.get), znsClient],
        ])
        .hasFinalState({
          value: {
            ids: [],
            entities: {
              'the-id': {
                id: 'the-id',
                title: 'The ZNS Feed Item',
                description: 'This is the description of the item.',
              },
            },
          },
          status: AsyncActionStatus.Idle,
          selectedItem: 'the-id',
        })
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

  const getZnsClient = (overrides = {}) => {
    return {
      getFeed: async () => [],
      getFeedItem: async () => ({}),
      resolveIdFromName: () => '',
      ...overrides,
    };
  };
});
