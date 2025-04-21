

export const getLocalSetting = (key: string): boolean | undefined => {
    const storedSettings = localStorage.getItem('localSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      return settings[key];
    }
    return undefined; 
  };