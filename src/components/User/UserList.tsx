import { useEffect, useState } from 'react';
import { useAuth } from '../../Provider/authProvider';
import fileService from '../../services/fileService';
import UserListItem from './UserListItem.tsx';
import NewbieMentorService from '../../services/newbieMentorService';
import { useTranslation } from "react-i18next";
import { TypeEnum } from '../../Enums/TypeEnum.ts';
import { UserAssignCountDto } from '../../dtos/UserAssignCountDto.ts';

interface UserListProps {
    userId: string;
}

const UserList = ({ userId }: UserListProps) => {
    const [users, setUsers] = useState<UserAssignCountDto[]>([]);
    const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
    const { getRole } = useAuth();
    const [userRole, setUserRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUserRole = async () => {
            if (userId) {
                try {
                    const role = await getRole();
                    setUserRole(role);
                } catch (err) {
                    console.error("Failed to fetch user role:", err);
                }
            }
        };

        fetchUserRole();
    }, [userId]);


    useEffect(() => {
        const fetchUsers = async () => {
            let userData: UserAssignCountDto[] = [];
            setIsLoading(true);

            try {
                switch (userRole) {
                    case 'Newbie':
                        userData = await NewbieMentorService.getAssignments(userId, TypeEnum.Newbie);
                        break;
                    case 'Mentor':
                        userData = await NewbieMentorService.getAssignments(userId, TypeEnum.Mentor);
                        break;
                    case 'Admin':
                    case 'HR':
                        userData = await NewbieMentorService.getUsers(TypeEnum.Newbie);
                        break;
                }

                setUsers(userData);

                for (const user of userData) {
                    if (user.avatarId) {
                        const blob = await fileService.downloadFile(user.avatarId);
                        setUserAvatars(prev => ({
                            ...prev,
                            [user.id!]: URL.createObjectURL(blob)
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user list:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId && userRole) {
            fetchUsers();
        }

        return () => {
            Object.values(userAvatars).forEach(URL.revokeObjectURL);
        };
    }, [userId, userRole]);

    if (isLoading) {
        return (
            <div className="text-center p-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center text-muted p-3">
                {t('no-users-found')}
            </div>
        );
    }

    return (
        <div className="user-list">
            {users.map((user) => (
                <UserListItem
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    surname={user.surname}
                    position={user.position}
                    avatarUrl={userAvatars[user.id!]}
                />
            ))}
        </div>
    );
};

export default UserList;
