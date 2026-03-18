import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { CreditCalculatorService } from '@/modules/CreditCalculator/services/CreditCalculatorService';
import { QueryParamsService } from 'Common/services/queryParamsService.ts';
import { PassportService } from 'Modules/PassportCamera/services/passportService.ts';

class RootStore {
  readonly queryParamsStore = new QueryParamsService();
  readonly creditCalculatorService = new CreditCalculatorService();
  readonly passportService = new PassportService();
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

export function useQueryParamsStore() {
  return useRootStore().queryParamsStore;
}

export function useCreditCalculatorStore() {
  return useRootStore().creditCalculatorService;
}

export function usePassportStore() {
  return useRootStore().passportService;
}
