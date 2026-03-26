import Level1Icon from 'Assets/icons/loyalty/level_1.png';
import Level2Icon from 'Assets/icons/loyalty/level_2.png';
import Level3Icon from 'Assets/icons/loyalty/level_3.png';
import Level4Icon from 'Assets/icons/loyalty/level_4.png';
import Level5Icon from 'Assets/icons/loyalty/level_5.png';

export type LoyaltyLevel = 'standart' | 'bronze' | 'silver' | 'gold' | 'platinum';

export type ApiLoyaltyLevel = 'STANDART' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export const DEFAULT_LOYALTY_LEVEL: LoyaltyLevel = 'standart';

const loyaltyIconPathMap: Record<LoyaltyLevel, string> = {
  standart: Level1Icon,
  bronze: Level2Icon,
  silver: Level3Icon,
  gold: Level4Icon,
  platinum: Level5Icon,
};

const apiLoyaltyLevelMap: Record<ApiLoyaltyLevel, LoyaltyLevel> = {
  STANDART: 'standart',
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

export function mapApiLoyaltyLevel(loyaltyLevel: string | null | undefined): LoyaltyLevel {
  if (!loyaltyLevel) {
    return DEFAULT_LOYALTY_LEVEL;
  }

  return apiLoyaltyLevelMap[loyaltyLevel as ApiLoyaltyLevel] ?? DEFAULT_LOYALTY_LEVEL;
}

export function getLoyaltyIconPath(loyaltyLevel: LoyaltyLevel): string {
  return loyaltyIconPathMap[loyaltyLevel] ?? loyaltyIconPathMap[DEFAULT_LOYALTY_LEVEL];
}
