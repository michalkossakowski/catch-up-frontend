import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Provider/authProvider";
import UserInfoCard from "./UserInfoCard";
import { getUserById } from "../../services/userService";
import fileService from "../../services/fileService";
import { UserDto } from "../../dtos/UserDto.ts";
import Loading from "../Loading/Loading.tsx";
import UserList from "./UserList.tsx";
import "./UserProfile.css";
import { useTranslation } from "react-i18next";

const mockUserDetails = {
    interests: [
        "Artificial Intelligence",
        "Cloud Computing",
        "Blockchain",
        "UX Design"
    ],
    contact: {
        email: "john.doe@company.com",
        phone: "+48 123 456 789",
        teams: "@johndoe",
        slack: "@john.doe"
    },
    location: "Building A, Floor 3, Room 302",
    department: "Software Development",
    languages: ["English (Fluent)", "Polish (Native)", "Spanish (Basic)"],
    bio: "Software developer with 5+ years of experience, specializing in frontend development with React and TypeScript."
};

const UserProfile = () => {
    const { userId } = useParams();
    const { user, getRole } = useAuth();
    const [profileUser, setProfileUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const { t } = useTranslation();

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

        const fetchUserRole = async () => {
            if (userId) {
                try {
                    const role = await getRole(userId);
                    setRole(role);
                } catch (err) {
                    console.error("Failed to fetch user role:", err);
                }
            }
        };

        fetchProfileData();
        fetchUserRole();

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
        return <div>{t('user-not-found')}</div>;
    }

    const getListTitle = () => {
        switch (role) {
            case 'Newbie': return t('my-mentors');
            case 'Mentor': return t('my-newbies');
            case 'Admin':
            case 'HR': return t('all-newbies');
            default: return '';
        }
    };

    return (
        <Container className="py-4">
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4} lg={3} className="text-center">
                            <UserInfoCard
                                name={profileUser?.name}
                                surname={profileUser?.surname}
                                position={profileUser?.position}
                                canEdit={isOwnProfile}
                                avatarUrl={isOwnProfile ? undefined : profilePicture}
                                compact={true}
                            />
                        </Col>
                        <Col md={8} lg={9}>
                            <h3 className="text-start mb-3">{t('profile-info')}</h3>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-building me-2"></i>
                                            {t('department')}
                                        </h5>
                                        <p className="text-start">{mockUserDetails.department}</p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            {t('location')}
                                        </h5>
                                        <p className="text-start">{mockUserDetails.location}</p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-envelope-at me-2"></i>
                                            {t('email')}
                                        </h5>
                                        <p className="text-start">
                                            <a href={`mailto:${mockUserDetails.contact.email}`}>
                                                {mockUserDetails.contact.email}
                                            </a>
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-telephone me-2"></i>
                                            {t('phone')}
                                        </h5>
                                        <p className="text-start">
                                            <a href={`tel:${mockUserDetails.contact.phone}`}>
                                                {mockUserDetails.contact.phone}
                                            </a>
                                        </p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-microsoft-teams me-2"></i>
                                            {t('teams')}
                                        </h5>
                                        <p className="text-start">{mockUserDetails.contact.teams}</p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-slack me-2"></i>
                                            {t('slack')}
                                        </h5>
                                        <p className="text-start">{mockUserDetails.contact.slack}</p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <i className="bi bi-stars me-2"></i>
                            {t('interests-and-skills')}
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <h5 className="text-start text-muted mb-2">
                                    <i className="bi bi-stars me-2"></i>
                                    {t('interests')}
                                </h5>
                                <ul className="text-start mb-3">
                                    {mockUserDetails.interests.map((interest, index) => (
                                        <li key={index}>{interest}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h5 className="text-start text-muted mb-2">
                                    <i className="bi bi-translate me-2"></i>
                                    {t('languages')}
                                </h5>
                                <ul className="text-start">
                                    {mockUserDetails.languages.map((language, index) => (
                                        <li key={index}>{language}</li>
                                    ))}
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6}>
                    {isOwnProfile ? (
                        <Card className="mb-4">
                            <Card.Header>
                                <i className="bi bi-people me-2"></i>
                                {getListTitle()}
                            </Card.Header>
                            <Card.Body className="p-0">
                                <UserList userId={userId} />
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="mb-4">
                            <Card.Header>
                                <i className="bi bi-info-circle me-2"></i>
                                {t('about')}
                            </Card.Header>
                            <Card.Body>
                                <p className="text-start">{mockUserDetails.bio}</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;