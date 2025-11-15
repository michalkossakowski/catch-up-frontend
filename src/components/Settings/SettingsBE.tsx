import { Form } from "react-bootstrap";
import CompanySettingsService from "../../services/companySettingsService";
import { useEffect } from "react";
import { useState } from "react";

const SettingsBE: React.FC = () => {
    const [timeLoggingEnabled, setTimeLoggingEnabled] = useState<boolean>(false);

    useEffect(() => {
        fetchSettings();
    }, []);
    const fetchSettings = () =>{
        CompanySettingsService.getTaskTimeLoggingSetting().then((res) => {
            setTimeLoggingEnabled(res);
        }).catch((err) => {
            console.error("Error fetching settings:", err);
        });
    };
    const handleTaskTimeLoggingSettingChange = (isEnabled: boolean) => {
        CompanySettingsService.setTaskTimeLoggingSetting(isEnabled).then(() => {
            setTimeLoggingEnabled(isEnabled);
        }).catch((err) => {
            console.error("Error updating task time logging setting:", err);
        }); 
    };
    return(
        <>
           <h3>Settings kept in the database:</h3>
            <div className='settings-list'>
                <div className='single-setting'>
                    Task - enable time logging
                    <Form>
                        <Form.Check 
                            type="switch"
                            id="placeholder-id"
                            checked={timeLoggingEnabled}
                            onChange={() => handleTaskTimeLoggingSettingChange(!timeLoggingEnabled)}
                        />
                    </Form>
                </div>

            </div>
        </>
    );

}

export default SettingsBE;