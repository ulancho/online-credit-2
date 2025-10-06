import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { CountryCodeService } from 'Modules/start/services/countryCodeService.ts';
import { QrInfoService } from 'Modules/start/services/qrInfoService.ts';
import { StartInfoService } from 'Modules/start/services/startInfoService.ts';

class RootStore {
  readonly countryCodesStore = new CountryCodeService();
  readonly startStore = new StartInfoService();
  readonly qrStore = new QrInfoService(this.startStore);
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

export function useQrStore() {
  return useRootStore().qrStore;
}
