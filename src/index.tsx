import { Provider } from 'react-redux';
import { FeedContainer, PublicProperties } from './container';
import { store } from './store';

export const App: React.FunctionComponent<PublicProperties> = (props: PublicProperties) => (
  <Provider store={store}>
    <FeedContainer {...props} />
  </Provider>
);
