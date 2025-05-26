import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './Settings.css';

interface Settings {
  [key: string]: boolean | string;
}

const initialSettings: Settings = {
  isBrainrotAllowed: false,
  isConfettiDisabled: false,
  aiResponseStyle: ""
};

const SettingsFE: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    const storedSettings = localStorage.getItem('localSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('localSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const settingLabels: { [key: string]: string } = {
    isBrainrotAllowed: 'RoadMaps - Show congratulations brainrot Tiktok',
    isConfettiDisabled: 'RoadMaps - Disable confetti',
    aiResponseStyle: 'AI Assistant - Response language style',
  };

  return (
    <>
      <h3>Settings kept in local storage:</h3>
      <div className='settings-list'>
        {Object.keys(initialSettings).map((key) => (
          <div key={key} className='single-setting'>
            <label htmlFor={`${key}-input`}>{settingLabels[key]}</label>
            {typeof initialSettings[key] === 'boolean' ? (
              <Form.Check
                type="switch"
                id={`${key}-switch`}
                checked={settings[key] as boolean}
                onChange={() => handleChange(key, !settings[key])}
              />
            ) : (
              <Form.Control
                type="text"
                id={`${key}-input`}
                value={settings[key] as string}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`Enter string value here...`}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SettingsFE;