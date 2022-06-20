import { spawn, takeLatest, put, call, select } from 'redux-saga/effects';
import { SagaActionTypes, receive, select as selectItem, setStatus, AsyncActionStatus } from './feed';

import { client, metadataService } from '@zer0-os/zos-zns';

export function* loadItemMetadata(action) {
  const items = yield select((state) => state.feed.value);

  const itemIndex = items.findIndex(item => item.id === action.payload);
  const item = items[itemIndex];

  yield spawn(fetchResource, item)
}

function* fetchResource(item) {
  if (item?.status?.metadata) return null;

  const metadata = yield call(metadataService.load, item.metadataUrl);

  const items = yield select((state) => state.feed.value);

  yield put(receive(items.map(i => {
    if (i.id === item.id) {
      return { ...item, ...metadata, ...{ status: { metadata: 'loaded' } } };
    }

    return i;
  })));
}

export function* load(action) {
  try {
    yield put(setStatus(AsyncActionStatus.Loading));

    const { route, provider } = action.payload;
  
    const znsClient = yield call(client.get, provider);
  
    const routeId = yield call([znsClient, znsClient.resolveIdFromName], route);
  
    const items = yield call([znsClient, znsClient.getFeed], routeId);

    yield put(receive(items));

    yield put(setStatus(AsyncActionStatus.Idle));
  } catch (error) {
    yield put(setStatus(AsyncActionStatus.Failed));
  }
}

export function* setSelectedItemByRoute(action) {
  const { route, provider } = action.payload;

  const znsClient = yield call(client.get, provider);

  const routeId = yield call([znsClient, znsClient.resolveIdFromName], route);

  const item = yield call([znsClient, znsClient.getFeedItem], routeId);

  yield put(selectItem(item));
}

export function* loadSelectedItemMetadata() {
  const item = yield select((state) => state.feed.selectedItem);

  if (!item?.metadataUrl) return null;

  const metadata = yield call(metadataService.load, item.metadataUrl);

  yield put(selectItem({ ...item, ...metadata }));
}

export function* saga() {
  yield takeLatest(SagaActionTypes.Load, load);
  yield takeLatest(SagaActionTypes.LoadItemMetadata, loadItemMetadata);
  yield takeLatest(SagaActionTypes.SetItemByRoute, setSelectedItemByRoute);
  yield takeLatest(SagaActionTypes.LoadSelectedItemMetadata, loadSelectedItemMetadata);
}
