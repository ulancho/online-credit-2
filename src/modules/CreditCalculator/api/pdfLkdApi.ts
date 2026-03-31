import { httpClient } from 'Common/api/httpClient.ts';

export type GeneratePdfLkdRequest = {
  amount: number;
  termMonths: number;
  nominalRate: number;
};

export type GeneratePdfLkdResponse = {
  pdf_base64: string;
};

const GENERATE_PDF_LKD_API = '/credit/generate/pdf-lkd';
// const GENERATE_PDF_LKD_API =
//   'https://preprodib.mbank.kg/svc-biz-ib-cbk-private-credits/v1/api/webview/credit/generate/pdf-lkd';

export async function generatePdfLkd(
  payload: GeneratePdfLkdRequest,
): Promise<GeneratePdfLkdResponse> {
  const response = await httpClient.post<GeneratePdfLkdResponse>(GENERATE_PDF_LKD_API, payload);

  return response.data;
}
