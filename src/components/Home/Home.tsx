import './Home.css';
import { useTranslation } from "react-i18next";

export default function Home(): React.ReactElement {
    const { t } = useTranslation();
    return(
        <>
            <div className="container">
                <h2>{t('welcome-in-catchup')}</h2>
                <h3>Something went wrong, we cannot fetch your role, refresh the page or re-login please.</h3>
            </div>
        </>
    );
}  

