import { createContext, useContext, type ReactNode } from 'react';

import { CountryCodesStore } from './countryCodesStore.ts';

class RootStore {
  readonly countryCodesStore = new CountryCodesStore();
}

const rootStore = new RootStore();
const RootStoreContext = createContext(rootStore);

export function RootStoreProvider({ children }: { children: ReactNode }) {
  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export function useRootStore() {
  return useContext(RootStoreContext);
}

export function useCountryCodesStore() {
  return useRootStore().countryCodesStore;
}
