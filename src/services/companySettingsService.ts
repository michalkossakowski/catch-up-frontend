let isTaskTimeLoggingEnabled = true;

const CompanySettingsService = {
    setTaskTimeLoggingSetting: async (isEnabled: boolean): Promise<void> => {
        console.log(`Mocked setTaskTimeLoggingSetting called with isEnabled: ${isEnabled}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        isTaskTimeLoggingEnabled = isEnabled;
    },
    getTaskTimeLoggingSetting: async (): Promise<boolean> => {
        console.log('Mocked getTaskTimeLoggingSetting called');
        await new Promise(resolve => setTimeout(resolve, 500));
        return isTaskTimeLoggingEnabled;
    }
};

export default CompanySettingsService;