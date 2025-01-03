import { useNavigate } from 'react-router-dom';
import defaultUserIcon from '../../assets/defaultUserIcon.jpg';
import './MentorListItem.css';

interface MentorListItemProps {
    id?: string;
    name?: string;
    surname?: string;
    position?: string;
    avatarUrl?: string;
}

const UserListItem = ({ id, name, surname, position, avatarUrl }: MentorListItemProps) => {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex align-items-center p-3 border rounded mb-2 mentor-list-item"
            onClick={() => id && navigate(`/profile/${id}`)}
        >
            <img
                src={avatarUrl || defaultUserIcon}
                className="rounded-circle bg-light"
                width={48}
                height={48}
                alt={`${name} ${surname}`}
            />
            <div className="ms-3 d-flex align-items-center justify-content-between flex-grow-1">
                <div>
                    <div className="text-start">{name} {surname}</div>
                    <div className="text-muted text-start">{position}</div>
                </div>
            </div>
        </div>
    );
};

export default UserListItem;