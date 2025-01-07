import { useEffect, useState } from 'react';
import { useAuth } from '../../Provider/authProvider';
import fileService from '../../services/fileService';
import UserListItem from './UserListItem.tsx';
import NewbieMentorService from '../../services/newbieMentorService';
import { UserDto } from '../../dtos/UserDto';

interface UserListProps {
    userId?: string;
}

const UserList = ({ userId }: UserListProps) => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
    const { getRole } = useAuth();
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const fetchUserRole = async () => {
            if (userId) {
                try {
                    const role = await getRole(userId);
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
            let userData: UserDto[] = [];

            switch (userRole) {
                case 'Newbie':
                    userData = await NewbieMentorService.getAssignmentsByNewbie(userId!);
                    break;
                case 'Mentor':
                    userData = await NewbieMentorService.getAssignmentsByMentor(userId!);
                    break;
                case 'Admin':
                case 'HR':
                    userData = await NewbieMentorService.getAllNewbies();
                    break;
            }

            setUsers(userData);

            for (const user of userData) {
                if (user.avatarId) {
                    const blob = await fileService.downloadFile(user.avatarId);
                    setUserAvatars(prev => ({
                        ...prev,
                        [user.id]: URL.createObjectURL(blob)
                    }));
                }
            }
        };

        if (userId && userRole) {
            fetchUsers();
        }

        return () => {
            Object.values(userAvatars).forEach(URL.revokeObjectURL);
        };
    }, [userId, userRole]);

    return (
        <div className="mt-3">
            {users.map((user) => (
                <UserListItem
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    surname={user.surname}
                    position={user.position}
                    avatarUrl={userAvatars[user.id]}
                />
            ))}
        </div>
    );
};

export default UserList;
