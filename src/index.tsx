import { AppContent, AppContextPanel, AppLayout } from '@zer0-os/zos-component-library';
import { Provider } from 'react-redux';
import { FeedContainer, PublicProperties } from './container';
import { store } from './store';

export const App: React.FunctionComponent<PublicProperties> = (props: PublicProperties) => (
  <Provider store={store}>
    <AppLayout>
      <AppContextPanel>
      </AppContextPanel>
      <AppContent>
        <FeedContainer {...props} />
      </AppContent>
    </AppLayout>
  </Provider>
);
