import SettingsBE from "./SettingsBE";
import SettingsFE from "./SettingsFE"


const SettingsComponent: React.FC = () => {
    return(
        <>
           <h1 className="title"><i className="bi bi-gear"/> Settings</h1>
           <SettingsFE/>
           <br></br>
           <SettingsBE/>
        </>
    );

}

export default SettingsComponent;