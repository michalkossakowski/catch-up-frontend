import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Provider/authProvider";
import UserInfoCard from "./UserInfoCard";
import { getUserById } from "../../services/userService";
import fileService from "../../services/fileService";
import { UserDto } from "../../dtos/UserDto.ts";
import Loading from "../Loading/Loading.tsx";
import UserList from "./UserList.tsx";

const UserProfile = () => {
    const { userId } = useParams();
    const { user, getRole } = useAuth();
    const [profileUser, setProfileUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    const isOwnProfile = user?.id === userId;

    useEffect(() => {
        let blobUrl: string | null = null;

        const fetchProfileData = async () => {
            try {
                if (!userId) return;

                setProfilePicture(null);
                setIsLoading(true);

                let userData;
                if (isOwnProfile) {
                    userData = user;
                } else {
                    userData = await getUserById(userId);
                }

                setProfileUser(userData);

                if (!isOwnProfile && userData?.avatarId) {
                    const blob = await fileService.downloadFile(userData.avatarId);
                    blobUrl = URL.createObjectURL(blob);
                    setProfilePicture(blobUrl);
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
                setProfilePicture(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();

        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [userId, user, isOwnProfile]);

    if (isLoading) {
        return <Loading />;
    }

    if (!profileUser) {
        return <div>User not found</div>;
    }

    const getListTitle = () => {
        const userRole = getRole(user?.id as string);
        switch (userRole) {
            case 'Newbie': return 'My Mentors';
            case 'Mentor': return 'My Newbies';
            case 'Admin':
            case 'HR': return 'All Newbies';
            default: return '';
        }
    };

    return (
        <Container className="py-4">
            <UserInfoCard
                name={profileUser?.name}
                surname={profileUser?.surname}
                position={profileUser?.position}
                canEdit={isOwnProfile}
                avatarUrl={isOwnProfile ? undefined : profilePicture}
            />

            {isOwnProfile && (
                <div className="mt-4">
                    <h3 className="text-start">{getListTitle()}</h3>
                    <UserList userId={userId} />
                </div>
            )}
        </Container>
    );
};

export default UserProfile;