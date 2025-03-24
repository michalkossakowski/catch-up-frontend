import { NavLink } from 'react-router-dom';
import './Home.css';
import { useTranslation } from "react-i18next";


export default function Home(): React.ReactElement {
    const { t } = useTranslation();
    return(
        <>
            <div className="container home_container">
                <h2>{t('welcome-in-catchup')}</h2>
                <div className="row">
                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/task-batman-image.jpg" className="card-img-top" alt="Tasks Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-list-task fs-4"></i> {t('tasks')}
                                </h5>
                                <p className="card-text">{t('manage-and-track-your-tasks')}</p>
                                <NavLink className="btn btn-primary" to="/tasks">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/schooling-batman-image.jpg" className="card-img-top" alt="Schoolings Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-book fs-4"></i> {t('schoolings')}
                                </h5>
                                <p className="card-text">{t('access-your-schoolings-list')}</p>
                                <NavLink className="btn btn-primary" to="/schoolinglist">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/feedback-batman-image.jpg" className="card-img-top" alt="Feedbacks Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-pencil-square fs-4"></i> {t('feedbacks')}
                                </h5>
                                <p className="card-text">{t('submit-and-view-feedbacks')}</p>
                                <NavLink  className="btn btn-primary" to="/feedbacks">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="FAQ Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-question-circle fs-4"></i> {t('faq')}
                                </h5>
                                <p className="card-text">{t('find-answers-to-hard-questions')}</p>
                                <NavLink className="btn btn-primary" to="/faq">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/inzynierka-na-kolanie.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-arrow-through-heart fs-4"></i>  {t('inzynierka-na-kolanie')}
                                </h5>
                                <p className="card-text">{t('grupa-inzynieryjna')}</p>
                                <NavLink className="btn btn-primary" to="/x">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-browser-firefox fs-4"></i>  {t('placeholder')}
                                </h5>
                                <p className="card-text">{t('placeholder')}.</p>
                                <NavLink className="btn btn-primary" to="/x">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-browser-firefox fs-4"></i>  {t('placeholder')}
                                </h5>
                                <p className="card-text">{t('placeholder')}.</p>
                                <NavLink className="btn btn-primary" to="/x">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card home-card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-browser-firefox fs-4"></i>  {t('placeholder')}
                                </h5>
                                <p className="card-text">{t('placeholder')}.</p>
                                <NavLink className="btn btn-primary" to="/x">{t('see-more')}</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}  

