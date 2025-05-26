import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeCard.css';

interface TaskCardProps {
  title: string;
  description: string;
  iconName: string; 
  path: string;
}

const HomeCard: React.FC<TaskCardProps> = ({ title, description, iconName, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div 
      className="home-card-container"
      onClick={handleClick}
    >
      <h2 className="home-card-container-title">{title}</h2>
      <p className="home-card-container-desc">{description}</p>
      <div className="home-card-container-icon">
        <i className={`bi ${iconName}`} />
      </div>
    </div>
  );
};

export default HomeCard;