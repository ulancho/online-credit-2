import { httpClient } from 'Common/api/httpClient';

export interface PassportProcessResponse {
  documentNumber: string;
  pin: string;
  dateExpiry: string;
  dateOfIssue: string;
  sex: string;
  authority: string;
  engName: string;
  engSurname: string;
  dateBirth: string;
  age: number;
}

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return response.blob();
};

export async function processPassportImages(
  frontDataUrl: string,
  backDataUrl: string,
): Promise<PassportProcessResponse> {
  const [frontBlob, backBlob] = await Promise.all([
    dataUrlToBlob(frontDataUrl),
    dataUrlToBlob(backDataUrl),
  ]);

  const formData = new FormData();
  formData.append('file', frontBlob, 'passport-front.jpg');
  formData.append('file', backBlob, 'passport-back.jpg');

  const response = await httpClient.post<PassportProcessResponse>(
    '/passport/process-images',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return response.data;
}
