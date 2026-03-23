import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { LoanCondtionsService } from '@/modules/LoanConditions/services/LoanConditionsService';
import { QueryParamsService } from 'Common/services/queryParamsService.ts';
import { ApplicationStatusService } from 'Modules/ApplicationStatusRedirect/services/ApplicationStatusService.ts';
import { ActivityTypeService } from 'Modules/CreditCalculator/services/ActivityTypeService.ts';
import { CreditRatesService } from 'Modules/CreditCalculator/services/CreditRatesService.ts';
import { LoanOffersService } from 'Modules/CreditCalculator/services/LoanOffersService.ts';
import { PassportService } from 'Modules/PassportCamera/services/passportService.ts';

class RootStore {
  readonly queryParamsStore = new QueryParamsService();
  readonly creditRatesService = new CreditRatesService();
  readonly passportService = new PassportService();
  readonly applicationStatusService = new ApplicationStatusService();
  readonly activityTypeService = new ActivityTypeService();
  readonly loanOffersService = new LoanOffersService();
  readonly loanCondtionsService = new LoanCondtionsService();
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

// Получение процентных ставок по кредиту для текущего клиента
export function useCreditRatesStore() {
  return useRootStore().creditRatesService;
}

export function usePassportStore() {
  return useRootStore().passportService;
}

export function useApplicationStatusStore() {
  return useRootStore().applicationStatusService;
}

export function useActivityTypeStore() {
  return useRootStore().activityTypeService;
}

export function useLoanOffersStore() {
  return useRootStore().loanOffersService;
}

export function useLoanConditionsStore() {
  return useRootStore().loanCondtionsService;
}
