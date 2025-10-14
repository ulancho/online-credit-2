import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { QueryParamsService } from 'Common/services/queryParamsService.ts';
import { CountryCodeService } from 'Modules/start/services/countryCodeService.ts';
import { PhoneAuthService } from 'Modules/start/services/phoneAuthService.ts';
import { QrInfoService } from 'Modules/start/services/qrInfoService.ts';
import { QrStatusService } from 'Modules/start/services/qrStatusService.ts';
import { StartInfoService } from 'Modules/start/services/startInfoService.ts';

class RootStore {
  readonly countryCodesStore = new CountryCodeService();
  readonly queryParamsStore = new QueryParamsService();
  readonly startStore = new StartInfoService(this.queryParamsStore);
  readonly qrStore = new QrInfoService(this.queryParamsStore);
  readonly qrStatusStore = new QrStatusService(
    this.startStore,
    this.queryParamsStore,
    this.qrStore,
  );
  readonly phoneAuthStore = new PhoneAuthService(this.queryParamsStore);
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

export function useQrStatusStore() {
  return useRootStore().qrStatusStore;
}

export function useQueryParamsStore() {
  return useRootStore().queryParamsStore;
}

export function usePhoneAuthStore() {
  return useRootStore().phoneAuthStore;
}
