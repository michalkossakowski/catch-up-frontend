import axiosInstance from '../../axiosConfig.ts'

const CompanySettingsService = {
    setTaskTimeLoggingSetting: async (isEnabled: boolean): Promise<void> => {
        try {
            await axiosInstance.patch<boolean>(`/CompanySettings/SetTaskTimeLoggingSetting/${isEnabled }`);
        } catch (error: any) {
            console.error('Error while setting task time logging setting', error);
            throw error;
        }
    },
    getTaskTimeLoggingSetting: async (): Promise<boolean> => {
        try {
            const response = await axiosInstance.get<boolean>('/CompanySettings/GetTaskTimeLoggingSetting');
            return response.data;
        } catch (error: any) {
            console.error('Error while getting task time logging setting', error);
            throw error;
        }
    }
};
export default CompanySettingsService;  