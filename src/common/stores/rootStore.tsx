import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { QueryParamsService } from 'Common/services/queryParamsService.ts';

class RootStore {
  readonly queryParamsStore = new QueryParamsService();
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
