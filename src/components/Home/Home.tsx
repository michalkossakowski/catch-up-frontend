import { NavLink } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home(): React.ReactElement {
    return(
        <>
            <div className= {`container ${styles.home_container}`}>
                <h2>Welcome in catchUp</h2>
                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/task-batman-image.jpg" className="card-img-top" alt="Tasks Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-list-task fs-4"></i> Tasks
                                </h5>
                                <p className="card-text">Manage and track your tasks.</p>
                                <NavLink className="btn btn-primary" to="/tasks">See more</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/schooling-batman-image.jpg" className="card-img-top" alt="Schoolings Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-book fs-4"></i> Schoolings
                                </h5>
                                <p className="card-text">Access your schoolings list.</p>
                                <NavLink className="btn btn-primary" to="/schoolinglist">See more</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/feedback-batman-image.jpg" className="card-img-top" alt="Feedbacks Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-pencil-square fs-4"></i> Feedbacks
                                </h5>
                                <p className="card-text">Submit and view feedbacks.</p>
                                <NavLink  className="btn btn-primary" to="/feedbacks">See more</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="FAQ Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-question-circle fs-4"></i> FAQ
                                </h5>
                                <p className="card-text">Find answers to hard questions.</p>
                                <NavLink className="btn btn-primary" to="/faq">See more</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-browser-firefox fs-4"></i>  Test for materials
                                </h5>
                                <p className="card-text">Placeholder.</p>
                                <NavLink className="btn btn-primary" to="/materialitem">See more</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-browser-firefox fs-4"></i>  Placeholder
                                </h5>
                                <p className="card-text">Placeholder.</p>
                                <NavLink className="btn btn-primary" to="/x">See more</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-browser-firefox fs-4"></i>  Placeholder
                                </h5>
                                <p className="card-text">Placeholder.</p>
                                <NavLink className="btn btn-primary" to="/x">See more</NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <img src="HomeImages/faq-batman-image.jpg" className="card-img-top" alt="Placegolder Image"/>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="bi bi-browser-firefox fs-4"></i>  Placeholder
                                </h5>
                                <p className="card-text">Placeholder.</p>
                                <NavLink className="btn btn-primary" to="/x">See more</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}  

