import { AIChatDto } from '../dtos/AIChatDto';

export const GetAIChatResponse = async (message: string): Promise<string> => {
  console.log(`Mocked GetAIChatResponse called with message: ${message}`);
  
  const aiChatDto: AIChatDto = {
      message: message,
      additionalPromptPreferences: `Use "normal" language style.`
  };

  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return a mocked response
  return "This is a mocked AI response.";
};

const handleError = (operation: string, error: any): void => {
  console.error(`${operation} failed:`, error);
  throw new Error('An unexpected error occurred in mock service');
};