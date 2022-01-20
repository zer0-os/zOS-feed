import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { saga } from './saga';

import { reducer as feed } from './feed';

const sagaMiddleware = createSagaMiddleware({
  onError: (e) => {
    console.error('Encountered uncaught error in root saga: ', e);
  },
});

export const store = configureStore({
  reducer: {
    feed,
  },
  middleware: (defaults) => defaults({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(saga);

export const { dispatch } = store;
export type RootState = ReturnType<typeof store.getState>;
