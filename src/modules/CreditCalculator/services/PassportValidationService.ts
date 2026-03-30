import { validatePassportExpiryByJwt } from 'Modules/CreditCalculator/api/passportValidationApi.ts';

export class PassportValidationService {
  async validatePassport(token: string | null, deviceId: string | null) {
    if (!token || !deviceId) {
      return null;
    }

    return await validatePassportExpiryByJwt({
      jwt: token,
      uuid: deviceId,
    });
  }
}
