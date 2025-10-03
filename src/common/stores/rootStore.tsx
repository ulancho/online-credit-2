import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { CountryCodeService } from '../../modules/start/services/countryCodeService.ts';
import { StartInfoService } from '../../modules/start/services/startInfoService.ts';

class RootStore {
  readonly countryCodesStore = new CountryCodeService();
  readonly startStore = new StartInfoService();
}

const rootStore = new RootStore();
const RootStoreContext = createContext(rootStore);

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // @ts-expect-error: dev helper
  window.rootStore = rootStore;
  // @ts-expect-error: dev helper
  window.toJS = toJS;
}

export function RootStoreProvider({ children }: { children: ReactNode }) {
  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export function useRootStore() {
  return useContext(RootStoreContext);
}

export function useCountryCodesStore() {
  return useRootStore().countryCodesStore;
}

export function useStartStore() {
  return useRootStore().startStore;
}
