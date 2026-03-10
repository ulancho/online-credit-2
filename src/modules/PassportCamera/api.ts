import { httpClient } from 'Common/api/httpClient';

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const res = await fetch(dataUrl);
  return res.blob();
};
export const uploadPassportPhotos = async (
  frontDataUrl: string,
  backDataUrl: string,
): Promise<void> => {
  const [frontBlob, backBlob] = await Promise.all([
    dataUrlToBlob(frontDataUrl),
    dataUrlToBlob(backDataUrl),
  ]);
  const formData = new FormData();
  formData.append('frontSide', frontBlob, 'front.jpg');
  formData.append('backSide', backBlob, 'back.jpg');
  await httpClient.post('/passport/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
