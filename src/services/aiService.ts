import axiosInstance from '../../axiosConfig';


export const GetAIChatResponse = async (message: string): Promise<string> => {
  try {
    const response = await axiosInstance.post('/AI/GetAIChatResponse', message)
    console.log('res',response);
    return response.data.message;
  } catch (error: any) {
    handleError('getAIChatResponse', error);
    throw error;
  }
};


const handleError = (operation: string, error: any): void => {
  console.error(`${operation} failed:`, error);
  if (!error.response) {
    throw new Error('API is not available');
  }
  throw new Error(error.response.data?.message || 'An unexpected error occurred');
};

