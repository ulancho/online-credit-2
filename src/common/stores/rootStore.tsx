import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { QueryParamsService } from 'Common/services/queryParamsService.ts';
import { CountryCodeService } from 'Modules/startDesktop/services/countryCodeService.ts';
import { PhoneAuthService } from 'Modules/startDesktop/services/phoneAuthService.ts';
import { QrInfoService } from 'Modules/startDesktop/services/qrInfoService.ts';
import { QrStatusService } from 'Modules/startDesktop/services/qrStatusService.ts';
import { StartInfoService } from 'Modules/startDesktop/services/startInfoService.ts';
import { MobileInfoService } from 'Modules/startMobile/services/MobileInfoService.ts';
import { MobileStatusService } from 'Modules/startMobile/services/MobileStatusService.ts';

class RootStore {
  readonly countryCodesStore = new CountryCodeService();
  readonly queryParamsStore = new QueryParamsService();
  readonly startStore = new StartInfoService(this.queryParamsStore);
  readonly qrStore = new QrInfoService(this.queryParamsStore);
  readonly qrStatusStore = new QrStatusService(this.startStore, this.queryParamsStore);
  readonly phoneAuthStore = new PhoneAuthService(this.startStore, this.queryParamsStore);
  readonly startMobileStatusStore = new MobileStatusService(this.queryParamsStore);
  readonly startMobileStore = new MobileInfoService(
    this.queryParamsStore,
    this.startMobileStatusStore,
  );
}

const rootStore = new RootStore();
const RootStoreContext = createContext(rootStore);

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // @ts-expect-errorDesktop: dev helper
  window.rootStore = rootStore;
  // @ts-expect-errorDesktop: dev helper
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

/**
 ***** /oauth/web/qr  *****
 */
export function useQrStore() {
  return useRootStore().qrStore;
}

/**
 ***** /oauth/web/qr/status  *****
 */
export function useQrStatusStore() {
  return useRootStore().qrStatusStore;
}

export function useQueryParamsStore() {
  return useRootStore().queryParamsStore;
}

export function usePhoneAuthStore() {
  return useRootStore().phoneAuthStore;
}

export function useStartMobileStore() {
  return useRootStore().startMobileStore;
}

export function useStartMobileStatusStore() {
  return useRootStore().startMobileStatusStore;
}
