import { takeLatest, put, call } from 'redux-saga/effects';
import { SagaActionTypes, receive, setStatus, AsyncActionStatus } from './feed';

import { client } from '@zer0-os/zos-zns';

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

export function* saga() {
  yield takeLatest(SagaActionTypes.Load, load);
}
