import { takeLatest, put, call } from 'redux-saga/effects';
import { SagaActionTypes, receive } from './feed';

import { client } from '@zer0-os/zos-zns';

export function* load(action) {
  const { route, provider } = action.payload;

  const znsClient = yield call(client.get, provider);

  const routeId = yield call([znsClient, znsClient.resolveIdFromName], route);

  const items = yield call([znsClient, znsClient.getFeed], routeId);

  yield put(receive(items));
}

export function* saga() {
  yield takeLatest(SagaActionTypes.Load, load);
}