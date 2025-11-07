import { LanguageProvider } from 'Common/i18n';
import { RootStoreProvider } from 'Common/stores/rootStore.tsx';

import App from './App.tsx';

const AppWrapper: React.FC = () => {
  return (
    <RootStoreProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </RootStoreProvider>
  );
};

export default AppWrapper;
