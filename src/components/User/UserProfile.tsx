import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
import userProfileService, { UserProfileDto } from "../../services/userProfileService";
import { Modal, Form } from "react-bootstrap";

const UserProfile = () => {
    const { userId } = useParams();
    const { user, getRole } = useAuth();
    const [profileUser, setProfileUser] = useState<UserDto | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const { t } = useTranslation();
    
    const interestsBoxRef = useRef<HTMLDivElement>(null);
    const userListBoxRef = useRef<HTMLDivElement>(null);
    const [userListHeight, setUserListHeight] = useState<number | null>(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<Partial<UserProfileDto>>({
        bio: '',
        department: '',
        location: '',
        phone: '',
        teamsUsername: '',
        slackUsername: '',
        interests: [],
        languages: []
    });
    const [interestsInput, setInterestsInput] = useState('');
    const [languagesInput, setLanguagesInput] = useState('');

    const isOwnProfile = user?.id === userId;
    const canEditProfile = isOwnProfile || role === 'Admin';

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

                const profileData = await userProfileService.getUserProfile(userId);
                setUserProfile(profileData);
                
                if (profileData) {
                    setEditForm({
                        bio: profileData.bio || '',
                        department: profileData.department || '',
                        location: profileData.location || '',
                        phone: profileData.phone || '',
                        teamsUsername: profileData.teamsUsername || '',
                        slackUsername: profileData.slackUsername || '',
                        interests: profileData.interests || [],
                        languages: profileData.languages || []
                    });
                    setInterestsInput(profileData.interests.join(', '));
                    setLanguagesInput(profileData.languages.join(', '));
                }

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
            try {
                const role = await getRole();
                setRole(role);
            } catch (err) {
                console.error("Failed to fetch user role:", err);
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
    
    useEffect(() => {
        const adjustHeight = () => {
            if (isOwnProfile && interestsBoxRef.current && userListBoxRef.current) {
                const interestsRect = interestsBoxRef.current.getBoundingClientRect();
                const userListRect = userListBoxRef.current.getBoundingClientRect();
                
                const interestsBottom = interestsRect.bottom;
                const userListTop = userListRect.top;
                
                const neededHeight = interestsBottom - userListTop;
                
                setUserListHeight(Math.max(neededHeight - 60, 100));
            }
        };
        
        if (isOwnProfile && !isLoading) {
            setTimeout(adjustHeight, 100);
            
            setTimeout(adjustHeight, 500);
        }
        
        window.addEventListener('resize', adjustHeight);
        
        return () => {
            window.removeEventListener('resize', adjustHeight);
        };
    }, [isOwnProfile, isLoading, profileUser]);

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

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInterestsInput(e.target.value);
    };

    const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLanguagesInput(e.target.value);
    };

    const handleSaveProfile = async () => {
        if (!userId) return;

        const interests = interestsInput
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const languages = languagesInput
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const updatedProfile: UserProfileDto = {
            userId,
            bio: editForm.bio || '',
            department: editForm.department || '',
            location: editForm.location || '',
            phone: editForm.phone || '',
            teamsUsername: editForm.teamsUsername || '',
            slackUsername: editForm.slackUsername || '',
            interests,
            languages
        };

        try {
            if (userProfile) {
                await userProfileService.updateUserProfile(updatedProfile);
            } else {
                await userProfileService.createUserProfile(updatedProfile);
            }
            setUserProfile(updatedProfile);
            setShowEditModal(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };

    const renderBioBox = () => (
        <Card className="mb-3 content-fit-card">
            <Card.Header>
                <i className="bi bi-info-circle me-2"></i>
                {t('about')}
            </Card.Header>
            <Card.Body>
                <p className="text-start">{userProfile?.bio || t('no-bio-available')}</p>
            </Card.Body>
        </Card>
    );

    const renderInterestsBox = () => (
        <div ref={interestsBoxRef}>
            <Card className="mb-3 content-fit-card">
                <Card.Header>
                    <i className="bi bi-list-stars me-2"></i>
                    {t('interests-and-skills')}
                </Card.Header>
                <Card.Body>
                    <div className="mb-3">
                        <h5 className="text-start text-muted mb-2">
                            <i className="bi bi-bookmark-star me-2"></i>
                            {t('interests')}
                        </h5>
                        {userProfile?.interests && userProfile.interests.length > 0 ? (
                            <ul className="text-start mb-3">
                                {userProfile.interests.map((interest, index) => (
                                    <li key={index}>{interest}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-start text-muted">{t('no-interests-available')}</p>
                        )}
                    </div>
                    
                    <div>
                        <h5 className="text-start text-muted mb-2">
                            <i className="bi bi-translate me-2"></i>
                            {t('languages')}
                        </h5>
                        {userProfile?.languages && userProfile.languages.length > 0 ? (
                            <ul className="text-start">
                                {userProfile.languages.map((language, index) => (
                                    <li key={index}>{language}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-start text-muted">{t('no-languages-available')}</p>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );

    const renderUserListBox = () => (
        <div ref={userListBoxRef}>
            <Card className="mb-3">
                <Card.Header>
                    <i className="bi bi-people me-2"></i>
                    {getListTitle()}
                </Card.Header>
                <Card.Body 
                    className="p-0 overflow-auto" 
                    style={{
                        height: userListHeight ? `${userListHeight}px` : 'auto',
                        maxHeight: userListHeight ? `${userListHeight}px` : '300px'
                    }}
                >
                    <UserList userId={userId} />
                </Card.Body>
            </Card>
        </div>
    );

    return (
        <Container className="profile-container pb-4">
            <Card className="mb-3">
                <Card.Body>
                    <Row>
                        <Col md={4} lg={3} className="text-center d-flex align-items-center">
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
                            <h3 className="text-start mb-3">
                                {t('profile-info')}
                                {canEditProfile && (
                                    <Button 
                                        variant="outline-primary"
                                        size="sm"
                                        className="ms-3"
                                        onClick={handleEditProfile}
                                    >
                                        <i className="bi bi-pencil me-1"></i>
                                        {t('edit')}
                                    </Button>
                                )}
                            </h3>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-building me-2"></i>
                                            {t('department')}
                                        </h5>
                                        <p className="text-start">{userProfile?.department || t('not-specified')}</p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            {t('location')}
                                        </h5>
                                        <p className="text-start">{userProfile?.location || t('not-specified')}</p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-envelope-at me-2"></i>
                                            {t('email')}
                                        </h5>
                                        <p className="text-start">
                                            <a href={`mailto:${profileUser?.email}`}>
                                                {profileUser?.email}
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
                                            {userProfile?.phone ? (
                                                <a href={`tel:${userProfile.phone}`}>
                                                    {userProfile.phone}
                                                </a>
                                            ) : (
                                                t('not-specified')
                                            )}
                                        </p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-microsoft-teams me-2"></i>
                                            {t('teams')}
                                        </h5>
                                        <p className="text-start">{userProfile?.teamsUsername || t('not-specified')}</p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h5 className="text-start text-muted mb-1">
                                            <i className="bi bi-slack me-2"></i>
                                            {t('slack')}
                                        </h5>
                                        <p className="text-start">{userProfile?.slackUsername || t('not-specified')}</p>
                </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            
            <Row className="profile-bottom-section">
                {isOwnProfile ? (
                    <>
                        <Col md={6} className="d-flex flex-column">
                            {renderBioBox()}
                            {renderInterestsBox()}
                        </Col>
                        <Col md={6}>
                            {renderUserListBox()}
                        </Col>
                    </>
                ) : (
                    <>
                        <Col md={6}>
                            {renderInterestsBox()}
                        </Col>
                        <Col md={6}>
                            {renderBioBox()}
                        </Col>
                    </>
                )}
            </Row>

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('edit-profile')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('bio')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="bio"
                                value={editForm.bio}
                                onChange={handleInputChange}
                                placeholder={t('enter-bio')}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('department')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="department"
                                        value={editForm.department}
                                        onChange={handleInputChange}
                                        placeholder={t('enter-department')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('location')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={editForm.location}
                                        onChange={handleInputChange}
                                        placeholder={t('enter-location')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('phone')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleInputChange}
                                        placeholder={t('enter-phone')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('teams')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="teamsUsername"
                                        value={editForm.teamsUsername}
                                        onChange={handleInputChange}
                                        placeholder={t('enter-teams-username')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>{t('slack')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="slackUsername"
                                value={editForm.slackUsername}
                                onChange={handleInputChange}
                                placeholder={t('enter-slack-username')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t('interests')} ({t('comma-separated')})</Form.Label>
                            <Form.Control
                                type="text"
                                value={interestsInput}
                                onChange={handleInterestsChange}
                                placeholder={t('enter-interests')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t('languages')} ({t('comma-separated')})</Form.Label>
                            <Form.Control
                                type="text"
                                value={languagesInput}
                                onChange={handleLanguagesChange}
                                placeholder={t('enter-languages')}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        {t('cancel')}
                    </Button>
                    <Button variant="primary" onClick={handleSaveProfile}>
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserProfile;