import React, { useState } from 'react';
import Tour, { ReactourStep } from 'reactour';
import disableScroll from 'disable-scroll';
import './Tutorial.css';
import {tourStepStyle} from "../../componentStyles/tourStyles.tsx";

const steps : ReactourStep[] = [
  {
    content: 'Welcome to the app! Press arrow to start the tutorial.',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="left-sidebar"]',
    content: 'This is the side menu where you will find all the tabs that interest you.',
    position: 'right',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="hide-sidebar"]',
    content: 'This button allows you to show and hide sidebar menu.',
    position: 'bottom',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="top-navbar"]',
    content: 'Here you can change you theme, language, settings, see your profile and notifications.',
    position: 'bottom',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="top-navbar-logout"]',
    content: 'This button logs you out of your account.',
    position: 'bottom',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="home-tools"]',
    content: 'This is the main section where the content will appear. For example this is your home shortcuts.',
    position: 'right',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="home-events"]',
    content: 'And that is your upcoming events.',
    position: 'right',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="faq-nav-link"]',
    content: 'If you have any questions, you can find answears in the FAQ section.',
    position: 'right',
    style: tourStepStyle(),
  },
  {
    selector: '[data-tour="ai-assistant"]',
    content: 'If you have unusual questions, you can use our AI Assistant.',
    position: 'left',
    style: tourStepStyle(),
  },
  {
    content: 'Ok i think you are ready to start using the app! Enjoy! Carpe Diem! Memento Mori! etc...',
    style: tourStepStyle(),
  },
];

const TutorialComponent: React.FC = () => {
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  const disableBody = (target: HTMLElement) => disableScroll.on(target);
  const enableBody = () => disableScroll.off();

  const closeTour = () => {
    setIsTourOpen(false);
  };

  return (
    <>
      <button className='btn tutorial-button' onClick={() => setIsTourOpen(true)} >
        How to use this app ?
      </button>
       
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={closeTour}
        accentColor="#db91d1"
        rounded={5}
        maskSpace={5}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
        maskClassName='custom-tour-mask'
        showNavigation
        showButtons
        showCloseButton
        lastStepNextButton={
          <button className="btn btn-primary">
            Yeah!
          </button>
        }
        badgeContent={(curr: number, tot: number) => `${curr} of ${tot}`}
      />
    </>
  );
};

export default TutorialComponent;