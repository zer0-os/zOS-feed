import { takeLatest, put, call, select } from 'redux-saga/effects';
import { SagaActionTypes, receive, select as selectItem, setStatus, AsyncActionStatus } from './feed';

import { client } from '@zer0-os/zos-zns';
import { fetchMetadata } from '../util/feed';

export function* loadItem(action) {
  const items = yield select((state) => state.feed.value);

  const itemIndex = items.findIndex(item => item.id === action.payload );
  const item = items[itemIndex];

  const metadata = yield call(fetchMetadata, item.metadataUrl);

  const newItem = { ...item, ...metadata };

  yield put(receive([ ...items.slice(0, itemIndex), newItem, ...items.slice(itemIndex) ]));
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

export function* setSelectedItem(action) {
  const item = action.payload;

  yield put(selectItem(item));
}

export function* saga() {
  yield takeLatest(SagaActionTypes.Load, load);
  yield takeLatest(SagaActionTypes.LoadItem, loadItem);
  yield takeLatest(SagaActionTypes.SetItem, setSelectedItem);
  yield takeLatest(SagaActionTypes.SetItemByRoute, setSelectedItemByRoute);
}
