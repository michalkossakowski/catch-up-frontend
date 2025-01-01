import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../../Provider/authProvider";
import UserInfoCard from "./UserInfoCard";
import MentorListItem from "./MentorListItem";
import axiosInstance from "../../../axiosConfig";

interface Mentor {
    id: string;
    name: string;
    surname: string;
    position: string;
}

const UserProfile = () => {
    const { user } = useAuth();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [mentorsLoading, setMentorsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMentors = async () => {
            if (!user) return;

            try {
                const response = await axiosInstance.get(
                    `NewbieMentor/GetAssignmentsByNewbie/${user.id}`
                );
                setMentors(response.data);
            } catch (error) {
                console.error("Failed to fetch mentors:", error);
            } finally {
                setMentorsLoading(false);
            }
        };

        fetchMentors();
    }, [user]);

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <Container className="py-4">
            <UserInfoCard
                name={user.name}
                surname={user.surname}
                position={user.position}
            />

            <div className="mt-4">
                <h3 className="text-start">Mentors</h3>
                {mentorsLoading ? (
                    <p>Loading mentors...</p>
                ) : mentors.length === 0 ? (
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
        </Container>
    );
};

export default UserProfile;