import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { fetchDirectory, type DirectoryItem } from 'Common/api/directoryApi.ts';

const rawCountryFlagIcons = import.meta.glob('../../assets/icons/countries/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const countryFlagIcons = Object.create(null) as Record<string, string>;

for (const [path, iconSource] of Object.entries(rawCountryFlagIcons)) {
  const fileName = path.split('/').pop();

  if (!fileName) {
    continue;
  }

  const isoCode = fileName.replace(/\.[^.]+$/, '').toLowerCase();

  if (isoCode) {
    countryFlagIcons[isoCode] = iconSource;
  }
}

function resolveFlagIcon(isoCode?: string) {
  if (!isoCode) {
    return undefined;
  }

  return countryFlagIcons[isoCode.toLowerCase()];
}

const COUNTRY_CODES_DIRECTORY = 'country_codes';
export const DEFAULT_PHONE_DIGITS_LENGTH = 12;

export interface CountryCode {
  id: string;
  isoCode: string;
  country: string;
  code: string;
  phoneMask?: string;
  digitsCount: number;
  flagUrl?: string;
}

export class CountryCodeService {
  @observable.shallow countryCodes: CountryCode[] = [];
  @observable awaiting = false;
  @observable errorMessage: string | undefined = undefined;
  @observable isFetched = false;

  constructor(private readonly directoryFetcher: typeof fetchDirectory = fetchDirectory) {
    makeObservable(this);
  }

  @action
  setErrorMessage(message: string | undefined) {
    this.errorMessage = message;
  }

  @action
  reset() {
    this.countryCodes = [];
    this.awaiting = false;
    this.isFetched = false;
    this.errorMessage = undefined;
  }

  @action
  async fetchCountryCodes(forceReload = false) {
    if (this.awaiting) {
      return;
    }

    if (this.isFetched && !forceReload) {
      return;
    }

    this.awaiting = true;
    this.errorMessage = undefined;

    try {
      const directory = await this.directoryFetcher(COUNTRY_CODES_DIRECTORY);
      const items: DirectoryItem[] = Array.isArray(directory.directoryItemList)
        ? directory.directoryItemList
        : [];

      const mappedCountryCodes = items
        .filter((item) => item.active)
        .sort((a, b) => a.position - b.position)
        .map((item) => this.mapToCountryCode(item));

      runInAction(() => {
        this.countryCodes = mappedCountryCodes;
        this.isFetched = true;
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить справочник телефонных кодов.';

      runInAction(() => {
        this.countryCodes = [];
        this.isFetched = false;
        this.errorMessage = message;
      });
    } finally {
      runInAction(() => {
        this.awaiting = false;
      });
    }
  }

  @computed
  get isLoading() {
    return this.awaiting;
  }

  @computed
  get hasError() {
    return Boolean(this.errorMessage);
  }

  @computed
  get isLoaded() {
    return this.isFetched;
  }

  @computed
  get error() {
    return this.errorMessage ?? null;
  }

  private mapToCountryCode(item: DirectoryItem): CountryCode {
    const isoCode = item.paramList?.code ?? item.itemCode;
    const phoneCode = item.paramList?.phone_code ?? '';
    const mask = item.paramList?.phone_mask;
    const digitsCount = mask ? mask.replace(/[^X]/g, '').length : 0;
    const flagIcon = resolveFlagIcon(isoCode ?? item.itemCode);

    return {
      id: item.itemCode,
      isoCode,
      country: item.localizedName ?? item.name,
      code: phoneCode ? `+${phoneCode}` : '',
      phoneMask: mask,
      digitsCount: digitsCount > 0 ? digitsCount : DEFAULT_PHONE_DIGITS_LENGTH,
      flagUrl: flagIcon,
    };
  }
}
