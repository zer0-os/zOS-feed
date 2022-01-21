import { Provider } from 'react-redux';
import { FeedContainer, Properties } from './container';
import { store } from './store';

export const App = (props: Properties) => (
  <Provider store={store}>
    <FeedContainer {...props} />
  </Provider>
);
