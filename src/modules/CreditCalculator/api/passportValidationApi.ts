import axios from 'axios';

export type PassportValidationResponse = {
  valid: boolean;
  isHidden: boolean;
  title: string;
  description: string;
};

const PASSPORT_VALIDATE_EXPIRY_BY_JWT_API =
  'https://hub-dev.mbank.kg/gateway/api/customers/passport/validate-expiry/by-jwt';

export async function validatePassportExpiryByJwt({
  jwt,
  uuid,
}: {
  jwt: string;
  uuid: string;
}): Promise<PassportValidationResponse> {
  const response = await axios.post<PassportValidationResponse>(
    PASSPORT_VALIDATE_EXPIRY_BY_JWT_API,
    null,
    {
      headers: {
        jwt,
        uuid,
      },
    },
  );

  return response.data;
}
