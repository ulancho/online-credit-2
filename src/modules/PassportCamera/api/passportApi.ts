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

const MAX_IMAGE_WIDTH = 1600;
const MAX_IMAGE_HEIGHT = 1600;
const JPEG_QUALITY = 0.8;

const dataUrlToImage = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load passport image'));
    image.src = dataUrl;
  });

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('Failed to compress passport image'));
      },
      'image/jpeg',
      quality,
    );
  });

const compressPassportImage = async (dataUrl: string): Promise<Blob> => {
  const image = await dataUrlToImage(dataUrl);
  const scale = Math.min(MAX_IMAGE_WIDTH / image.width, MAX_IMAGE_HEIGHT / image.height, 1);
  const targetWidth = Math.round(image.width * scale);
  const targetHeight = Math.round(image.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to create image canvas');
  }

  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  return canvasToBlob(canvas, JPEG_QUALITY);
};

export async function processPassportImages(
  frontDataUrl: string,
  backDataUrl: string,
): Promise<PassportProcessResponse> {
  const [frontBlob, backBlob] = await Promise.all([
    compressPassportImage(frontDataUrl),
    compressPassportImage(backDataUrl),
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
