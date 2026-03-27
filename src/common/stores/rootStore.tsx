import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { DataFillStep1Service } from '@/modules/DataFillStep1/services/DataFillStep1Service';
import { DataFillStep2Service } from '@/modules/DataFillStep2/services/DataFillStep2Service';
import { InsuranceCompaniesService } from '@/modules/InsuranceCompanies/services/InsuranceCompaniesService';
import { LoanCondtionsService } from '@/modules/LoanConditions/services/LoanConditionsService';
import { LoanConfirmationService } from '@/modules/LoanConfirmation/services/LoanConfirmationService';
import { ApplicationService } from 'Common/services/ApplicationService.ts';
import { QueryParamsService } from 'Common/services/queryParamsService.ts';
import { ApplicationStatusService } from 'Modules/ApplicationStatusRedirect/services/ApplicationStatusService.ts';
import { CoolingService } from 'Modules/Cooling/services/CoolingService.ts';
import { ActivityTypeService } from 'Modules/CreditCalculator/services/ActivityTypeService.ts';
import { CreditApplicationService } from 'Modules/CreditCalculator/services/CreditApplicationService.ts';
import { CreditRatesService } from 'Modules/CreditCalculator/services/CreditRatesService.ts';
import { LoanOffersService } from 'Modules/CreditCalculator/services/LoanOffersService.ts';
import { LoanProcessingService } from 'Modules/Loader/services/LoanProcessingService.ts';
import { PassportService } from 'Modules/PassportCamera/services/passportService.ts';

class RootStore {
  readonly queryParamsStore = new QueryParamsService();
  readonly creditRatesService = new CreditRatesService();
  readonly passportService = new PassportService();
  readonly applicationStatusService = new ApplicationStatusService();
  readonly activityTypeService = new ActivityTypeService();
  readonly loanOffersService = new LoanOffersService();
  readonly loanCondtionsService = new LoanCondtionsService();
  readonly creditApplicationService = new CreditApplicationService();
  readonly loanProcessingService = new LoanProcessingService();
  readonly insuranceCompaniesService = new InsuranceCompaniesService();
  readonly loanConfirmationService = new LoanConfirmationService();
  readonly dataFillStep1Service = new DataFillStep1Service();
  readonly dataFillStep2Service = new DataFillStep2Service();
  readonly coolingService = new CoolingService();
  readonly applicationService = new ApplicationService();
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

export function useCreditApplicationStore() {
  return useRootStore().creditApplicationService;
}

export function useLoanProcessingStore() {
  return useRootStore().loanProcessingService;
}

export function useLoanConfirmationStore() {
  return useRootStore().loanConfirmationService;
}

export function useInsuranceCompaniesStore() {
  return useRootStore().insuranceCompaniesService;
}

export function useDataFillStep1Store() {
  return useRootStore().dataFillStep1Service;
}

export function useDataFillStep2Store() {
  return useRootStore().dataFillStep2Service;
}

export function useCoolingStore() {
  return useRootStore().coolingService;
}

export function useApplicationStore() {
  return useRootStore().applicationService;
}
