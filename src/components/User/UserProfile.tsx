import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Provider/authProvider";
import UserInfoCard from "./UserInfoCard";
import MentorListItem from "./MentorListItem";
import axiosInstance from "../../../axiosConfig";
import { getUserById } from "../../services/userService";
import fileService from "../../services/fileService";
import {UserDto} from "../../dtos/UserDto.ts";
import Loading from "../Loading/Loading.tsx";

interface Mentor {
    id: string;
    name: string;
    surname: string;
    position: string;
}

const UserProfile = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const [profileUser, setProfileUser] = useState<UserDto | null>(null);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    const isOwnProfile = user?.id === userId;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (!userId) return;

                let userData;
                if (isOwnProfile) {
                    userData = user;
                } else {
                    userData = await getUserById(userId);
                }

                setProfileUser(userData);

                // Fetch profile picture if viewing another user's profile
                if (!isOwnProfile && userData?.avatarId) {
                    const blob = await fileService.downloadFile(userData.avatarId);
                    setProfilePicture(URL.createObjectURL(blob));
                }

                // Only fetch mentors for own profile
                if (isOwnProfile) {
                    const response = await axiosInstance.get(
                        `NewbieMentor/GetAssignmentsByNewbie/${userId}`
                    );
                    setMentors(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();

        // Cleanup URL object on unmount
        return () => {
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, [userId, user, isOwnProfile]);

    if (isLoading) {
        return <Loading />;
    }

    if (!profileUser) {
        return <div>User not found</div>;
    }

    return (
        <Container className="py-4">
            <UserInfoCard
                name={profileUser.name}
                surname={profileUser.surname}
                position={profileUser.position}
                canEdit={isOwnProfile}
                avatarUrl={isOwnProfile ? undefined : profilePicture}
            />

            {isOwnProfile && (
                <div className="mt-4">
                    <h3 className="text-start">Mentors</h3>
                    {mentors.length === 0 ? (
                        <p>No mentors assigned.</p>
                    ) : (
                        <div className="mt-3">
                            {mentors.map((mentor) => (
                                <MentorListItem
                                    key={mentor.id}
                                    name={mentor.name}
                                    surname={mentor.surname}
                                    position={mentor.position}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Container>
    );
};

export default UserProfile;