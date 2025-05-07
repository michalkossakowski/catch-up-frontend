

export const getLocalSetting = (key: string): boolean | string | undefined => {
    const storedSettings = localStorage.getItem('localSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      return settings[key];
    }
    return undefined; 
  };