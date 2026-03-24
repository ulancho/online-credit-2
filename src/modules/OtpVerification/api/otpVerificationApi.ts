import { httpClient } from '@/common/api/httpClient';

type OtpConfirmPayload = {
  code: string;
};

const OTP_CONFIRM_API = '/credit/application/confirm/otp';

export async function confirmOtp(payload: OtpConfirmPayload) {
  return await httpClient.post(OTP_CONFIRM_API, payload);
}
