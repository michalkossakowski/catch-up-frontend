import { useNavigate } from 'react-router-dom';
import defaultUserIcon from '../../assets/defaultUserIcon.jpg';
import './UserListItem.css';

interface UserListItemProps {
    id?: string;
    name?: string;
    surname?: string;
    position?: string;
    avatarUrl?: string;
}

const UserListItem = ({ id, name, surname, position, avatarUrl }: UserListItemProps) => {
    const navigate = useNavigate();

    return (
        <div
            className="user-list-item d-flex align-items-center p-3 mb-1"
            onClick={() => id && navigate(`/profile/${id}`)}
        >
            <img
                src={avatarUrl || defaultUserIcon}
                className="user-list-avatar rounded-circle"
                width={42}
                height={42}
                alt={`${name} ${surname}`}
            />
            <div className="ms-3 d-flex align-items-center justify-content-between flex-grow-1">
                <div>
                    <div className="text-start user-list-name">{name} {surname}</div>
                    <div className="text-muted text-start user-list-position">{position}</div>
                </div>
                <i className="bi bi-chevron-right user-list-arrow"></i>
            </div>
        </div>
    );
};

export default UserListItem;