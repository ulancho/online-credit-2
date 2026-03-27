import axios from 'axios';

export const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data.message;
  else if (error instanceof Error) return error.message;
  else return 'Что то пошло не так';
};
