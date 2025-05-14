import axiosInstance from '../../axiosConfig';
import { AIChatDto } from '../dtos/AIChatDto';
import { getLocalSetting } from '../Provider/LocalSettingProvider';


export const GetAIChatResponse = async (message: string): Promise<string> => {
  try {
    let aiResponseStyle = getLocalSetting('aiResponseStyle')?.toString();
   
    if(aiResponseStyle == undefined || aiResponseStyle.trim() === ""){
      aiResponseStyle = "normal"
    }

    let aiChatDto: AIChatDto = {
        message: message,
        additionalPromptPreferences: `Use "${aiResponseStyle}" language style.`
    };
    
    const response = await axiosInstance.post("/AI/GetAIChatResponse", aiChatDto)

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

