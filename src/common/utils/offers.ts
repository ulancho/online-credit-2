export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] ?? ''; // 👈 важно
      resolve(base64);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const downloadBase64File = (base64: string, fileName: string, mimeType: string) => {
  const link = document.createElement('a');
  link.href = `data:${mimeType};base64,${base64}`;
  link.download = fileName;
  link.click();
};
