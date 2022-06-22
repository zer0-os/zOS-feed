import { takeEvery, takeLatest, put, call, select, all } from 'redux-saga/effects';
import { SagaActionTypes, receive, receiveSelectedItem, setStatus, AsyncActionStatus, receiveItem } from './feed';

import { client, metadataService } from '@zer0-os/zos-zns';

export function* loadItemMetadata(action) {
  const item = yield select((state) => state.feed.value.entities[action.payload]);

  const metadata = yield call(metadataService.load, item.metadataUrl);

  yield put(receiveItem({ id: item.id, ...metadata }));
}

export function* load(action) {
  try {
    yield put(setStatus(AsyncActionStatus.Loading));

    const { route, provider } = action.payload;
  
    const znsClient = yield call(client.get, provider);
  
    const routeId = yield call([znsClient, znsClient.resolveIdFromName], route);
  
    const item = yield call([znsClient, znsClient.getFeedItem], routeId);
    yield put(receiveSelectedItem(item));

    const items = yield call([znsClient, znsClient.getFeed], routeId);
    yield put(receive(items));

    yield put(setStatus(AsyncActionStatus.Idle));
  } catch (error) {
    yield put(setStatus(AsyncActionStatus.Failed));
  }
}

export function* loadSelectedItemMetadata() {
  const item = yield select((state) => state.feed.selectedItem);

  if (!item?.metadataUrl) return null;

  const metadata = yield call(metadataService.load, item.metadataUrl);

  yield put(receiveSelectedItem({ ...item, ...metadata }));
}

export function* saga() {
  yield all([
    yield takeLatest(SagaActionTypes.Load, load),
    yield takeEvery(SagaActionTypes.LoadItemMetadata, loadItemMetadata),
    yield takeLatest(SagaActionTypes.LoadSelectedItemMetadata, loadSelectedItemMetadata),
  ]);
}
