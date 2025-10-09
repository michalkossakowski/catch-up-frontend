import React, { useState } from 'react';
import './Home.css';
import HomeCard from './HomeCard/HomeCard';
import './Home.css';
import UpcomingEvents from '../Events/UpcomingEvents/UpcomingEvents';
import { useAuth } from '../../Provider/authProvider';
import UnassignedNewbiesList from '../HR/UnassignedNewbiesList';
import TutorialComponent from '../Tutorial/Tutorial';
import EventCreatorModal from '../Events/EventCreatorModal';

interface HomeProps {
    role: string | null;
}
export default function Home({ role }: HomeProps): React.ReactElement {
      const { user } = useAuth();
      const [showEventModal, setShowEventModal] = useState(false);
    return(
        <>
            {role == null ? (
                <h2>Something went wrong, we cannot fetch your role, refresh the page or re-login please.</h2>
            ): (
                <>
                    <h1 className="title"><i className='bi bi-house-door'/> Welcome in the {role} Dashboard!</h1>
                    <p className="lead">
                        From here you have easy and convenient access to your tools
                    </p>              
                        <div className="home-container">
                        {(() => { switch (role) {
                            case "Admin":
                                return(
                                    <>
                                        <div className="home-cards-container" data-tour="home-tools">
                                            <HomeCard
                                                title="Tasks Manager" 
                                                description="Manage, assign and process tasks for newbies." 
                                                iconName="bi-list-check" 
                                                path="/taskmanage"
                                            />
                                            
                                            <HomeCard
                                                title="Add Users" 
                                                description="Add new users to your organization." 
                                                iconName="bi-person-plus" 
                                                path="/adduser"
                                            />
                            
                                            <HomeCard
                                                    title="Create Events"
                                                    description="Create events for newbies, mentors and other staff."
                                                    iconName="bi-calendar-event"
                                                    path="#"
                                                    onClick={() => setShowEventModal(true)} 
                                                />
                            
                                            <HomeCard
                                                title="Assignments" 
                                                description="Assign newbies to mentors." 
                                                iconName="bi-people" 
                                                path="/employeesassignment"
                                            />
                            
                                            <HomeCard
                                                title="Task Presets" 
                                                description="Create task presets for faster task assignment." 
                                                iconName="bi-stack-overflow" 
                                                path="/presetmanage"
                                            />
                            
                                            <HomeCard
                                                title="Task Contents" 
                                                description="Create universal task contents to assign to newbies." 
                                                iconName="bi-kanban" 
                                                path="/taskcontentmanage"
                                            />
                                            
                                            <HomeCard
                                                title="Roadmaps" 
                                                description="Create and manage roadmaps for your newbies to follow." 
                                                iconName="bi-compass" 
                                                path="/roadmapmanage"
                                            />
                            
                                            <HomeCard
                                                title="Feedbacks" 
                                                description="Explore and manage feedbacks from your newbies." 
                                                iconName="bi-arrow-clockwise" 
                                                path="/feedbacks"
                                            />
                                        </div>
                                    </>
                                );
                            case "HR":
                                return(
                                    <>     
                                        <div className="home-cards-container" data-tour="home-tools">
                                            <HomeCard
                                                title="Add Users" 
                                                description="Add new users to your organization." 
                                                iconName="bi-person-plus" 
                                                path="/adduser"
                                            />

                                            <HomeCard
                                                title="Assignments" 
                                                description="Assign newbies to mentors." 
                                                iconName="bi-people" 
                                                path="/employeesassignment"
                                            />

                                            <HomeCard
                                                    title="Create Events"
                                                    description="Create events for newbies, mentors and other staff."
                                                    iconName="bi-calendar-event"
                                                    path="#"
                                                    onClick={() => setShowEventModal(true)} 
                                                />

                                            <HomeCard
                                                title="Feedbacks" 
                                                description="Explore and manage feedbacks from application users." 
                                                iconName="bi-arrow-clockwise" 
                                                path="/feedbacks"
                                            />

                                            <HomeCard
                                                title="FAQ" 
                                                description="Find answear for frequently asked questions." 
                                                iconName="bi-question-circle" 
                                                path="/faq"
                                            />
                                        </div>

                                        <div className="home-extra-container">
                                            <UnassignedNewbiesList />
                                        </div>
                                    </>
                                );
                            case "Mentor":
                                return(
                                    <>
                                        <div className="home-cards-container" data-tour="home-tools">          
                                            <HomeCard
                                            title="Your Newbies" 
                                            description="View your assigned newbies." 
                                            iconName="bi-people" 
                                            path={`/profile/${user?.id}`}
                                            />
                                            
                                            <HomeCard
                                            title="Tasks Manager" 
                                            description="Manage, assign and process tasks for your newbies." 
                                            iconName="bi-list-check" 
                                            path="/taskmanage"
                                            />
                                
                                            <HomeCard
                                            title="Task Presets" 
                                            description="Create task presets for faster task assignment." 
                                            iconName="bi-stack-overflow" 
                                            path="/presetmanage"
                                            />
                                
                                            <HomeCard
                                            title="Task Contents" 
                                            description="Create universal task contents to assign to newbies." 
                                            iconName="bi-kanban" 
                                            path="/taskcontentmanage"
                                            />
                                            
                                            <HomeCard
                                            title="Roadmaps" 
                                            description="Create and manage roadmaps for your newbies to follow." 
                                            iconName="bi-compass" 
                                            path="/roadmapmanage"
                                            />
                                
                                            <HomeCard
                                            title="Feedbacks" 
                                            description="Explore and manage feedbacks from your newbies." 
                                            iconName="bi-arrow-clockwise" 
                                            path="/feedbacks"
                                            />
                                            
                                            <HomeCard
                                            title="Schoolings" 
                                            description="Create and manage schoolings for your newbies." 
                                            iconName="bi-book" 
                                            path="/schoolinglist"
                                            />
                                        </div>
                                    </>
                                )
                            case "Newbie":
                                return(
                                    <>
                                        <div className="home-cards-container" data-tour="home-tools">          
                                            <HomeCard
                                                title="Tasks" 
                                                description="Check out your assigned tasks and start working on them." 
                                                iconName="bi-list-check" 
                                                path="/tasks"
                                            />
                                            
                                            <HomeCard
                                                title="Schoolings" 
                                                description="Access helpful schoolings to learn and grow." 
                                                iconName="bi-book" 
                                                path="/schoolinglist"
                                            />

                                            <HomeCard
                                                title="Roadmaps" 
                                                description="Process roadmaps to guide your learning journey." 
                                                iconName="bi-compass" 
                                                path="/roadmapexplore"
                                            />

                                            <HomeCard
                                                title="Feedbacks" 
                                                description="Explore yours feedbacks." 
                                                iconName="bi-arrow-clockwise" 
                                                path="/feedbacks"
                                            />
                                            
                                            <HomeCard
                                                title="FAQ" 
                                                description="Find answear for frequently asked questions." 
                                                iconName="bi-question-circle" 
                                                path="/faq"
                                            />
                                            
                                            <HomeCard
                                                title="Yours Mentors" 
                                                description="View your profile and assigned mentors." 
                                                iconName="bi-person" 
                                                path={`/profile/${user?.id}`}
                                            />
                                            
                                            <HomeCard
                                                title="Settings" 
                                                description="Customize your application preferences." 
                                                iconName="bi-gear" 
                                                path="/settings"
                                            />
                                            
                                            <HomeCard
                                                title="Notifications" 
                                                description="Check your notifications and updates." 
                                                iconName="bi-bell" 
                                                path="/notifications"
                                            />
                                        </div>  
                                    </>
                                );
                                default:
                                    return <></>
                                }
                            })()}
                        <div className="home-events-container" data-tour="home-events">
                            <UpcomingEvents />
                        </div>
                    </div>  

                    <EventCreatorModal
                        show={showEventModal}
                        onClose={() => setShowEventModal(false)}
                    />   

                    <TutorialComponent />     
                </>  
            )}
        </>
    );
}