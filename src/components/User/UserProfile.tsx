import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../../Provider/authProvider";
import UserInfoCard from "./UserInfoCard";
import axiosInstance from "../../../axiosConfig";

interface Mentor {
    id: string;
    name: string;
    surname: string;
    position: string;
}

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
                setLoading(false);
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

            <h3 className="mt-4">Mentors</h3>
            {loading ? (
                <p>Loading mentors...</p>
            ) : mentors.length === 0 ? (
                <p>No mentors assigned.</p>
            ) : (
                <div className="mt-3">
                    {mentors.map((mentor) => (
                        <UserInfoCard
                            key={mentor.id}
                            name={mentor.name}
                            surname={mentor.surname}
                            position={mentor.position}
                        />
                    ))}
                </div>
            )}
        </Container>
    );
};

export default UserProfile;
