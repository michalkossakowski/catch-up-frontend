import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './Settings.css';

interface Settings {
  [key: string]: boolean;
}

const initialSettings: Settings = {
  isBrainrotAllowed: false,
  isConfettiDisabled: false,
  placeholder1: false,
  placeholder2: false,
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

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingLabels: { [key: string]: string } = {
    isBrainrotAllowed: 'Show brainrot tiktok on road maps congratulations screen',
    isConfettiDisabled: 'Disable confetti on finished road maps details screen',
    placeholder1: 'Placeholder 1',
    placeholder2: 'Placeholder 2',
  };

  return (
    <>
      <h3>Settings kept in local storage:</h3>
      <div className='settings-list'>
        {Object.keys(initialSettings).map((key) => (
          <div key={key} className='single-setting'>
            {settingLabels[key]}
            <Form>
              <Form.Check
                type="switch"
                id={`${key}-switch`}
                checked={settings[key]}
                onChange={() => handleToggle(key)}
              />
            </Form>
          </div>
        ))}
      </div>
    </>
  );
};

export default SettingsFE;

