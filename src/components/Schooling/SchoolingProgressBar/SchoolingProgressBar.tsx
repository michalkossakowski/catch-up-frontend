import { useEffect, useState } from "react";
import { Button, Card, CardBody, Nav, Navbar } from "react-bootstrap";
import "./SchoolingProgressBar.scss";
import { SchoolingDto } from "../../../dtos/SchoolingDto";
import { NavLink } from "react-router-dom";

interface SchoolingProgressBarProps {
  schooling?: SchoolingDto;
}
const SchoolingProgressBar: React.FC<SchoolingProgressBarProps> = ({
  schooling,
}) => {
  return (
    <div className="schooling-progress-bar">
      <h4><i className='bi-book'></i> Schooling:</h4>
      <NavLink
        to={`/Schooling/${schooling?.id}`}
        className="nav-link p-0 mb-4 schooling-title-link"
      >
        <h5> {schooling?.title}</h5>
      </NavLink>
      <div className="progress-bar-vertical">
        <Nav className="flex-column">
          {schooling?.schoolingParts?.map((part, index) => (
            <NavLink
              key={index}
              to={`/Schooling/${schooling.id}/part/${part.id}`}
              className="nav-link nav-link-schooling">
              <i className="schooling-dot bi-circle-fill"> </i>      
              <span>   
                {part.title}
              </span>
            </NavLink>
          ))}
        </Nav>
      </div>
    </div>
  );
};
export default SchoolingProgressBar;