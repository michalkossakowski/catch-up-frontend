import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { getAllBadges, deleteBadge, getByMentorId } from '../../services/badgeService';
import fileService from '../../services/fileService';
import BadgeForm from './BadgeForm';
import { BadgeDto } from '../../dtos/BadgeDto';
import Loading from '../Loading/Loading';
import { BadgeTypeCountEnum } from '../../Enums/BadgeTypeCountEnum';
import { useAuth } from '../../Provider/authProvider';
import defaultBadgeIcon from '../../assets/defaultBadgeIcon.png';
import { t } from 'i18next';

const Badge: React.FC = () => {
    const { user, getRole } = useAuth();
    const [badges, setBadges] = useState<BadgeDto[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingBadge, setEditingBadge] = useState<BadgeDto | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());

    useEffect(() => {
        fetchBadges();
        return () => {
            imageUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const fetchBadges = async () => {
        if (!user) return;
        try {
            const userRoleResponse = await getRole();
            setUserRole(userRoleResponse);
            const data = userRoleResponse === 'Mentor' ? await getByMentorId() : await getAllBadges();
            if (!data) {
                setError('No badges found');
            } else {
                setBadges(data);
                await fetchImages(data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch badges');
        } finally {
            setLoading(false);
        }
    };

    const fetchImages = async (badges: BadgeDto[]) => {
        const newImageUrls = new Map<number, string>();
        for (const badge of badges) {
            if (badge.iconId) {
                try {
                    const blob = await fileService.downloadFile(badge.iconId);
                    const url = URL.createObjectURL(blob);
                    newImageUrls.set(badge.iconId, url);
                } catch (error) {
                    console.error(`Failed to fetch image for badge ${badge.id}:`, error);
                    newImageUrls.set(badge.iconId, defaultBadgeIcon);
                }
            }
        }
        setImageUrls(newImageUrls);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this badge?')) {
            try {
                await deleteBadge(id);
                fetchBadges();
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleAddEdit = (badge?: BadgeDto) => {
        setEditingBadge(badge || null);
        setShowForm(true);
    };

    const getBadgeTypeName = (countType: BadgeTypeCountEnum | null | undefined): string => {
        if (countType === null || countType === undefined) return 'Custom';
        return (t(`${BadgeTypeCountEnum[countType]}`) + ': ') || 'Unknown';
    };

    const handleCloseForm = () => {
        setEditingBadge(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className='mt-4'>
                <Loading />
            </div>
        )
    }

    return (
        <>
            <h1 className='title'><i className='bi bi-shield'/> Badges</h1>
            <Container>
                <div className="d-flex justify-content-between align-items-center m-1">
                    {userRole !== 'Mentor' ? (
                        <>
                            <h2>Manage Badges:</h2>
                            <Button variant="primary" onClick={() => handleAddEdit()}>
                                <i className='bi-plus-lg' style={{color: 'white'}}></i> Add Badge
                            </Button>
                        </>
                    ) : (
                        <h2>My Badges:</h2>
                    )}
                </div>
                {error && (
                    <div className="mb-3">
                        <div className="alert alert-danger text-center">{error}</div>
                    </div>
                )}
                <Row xs={1} md={3} className="g-4 justify-content-center">
                    {badges != null && badges.length > 0 ? (
                        badges.map((badge) => (
                            <Col key={badge.id}>
                                <Card className="h-100">
                                    <Card.Img
                                        variant="top"
                                        src={badge.iconId ? imageUrls.get(badge.iconId) || defaultBadgeIcon : defaultBadgeIcon}
                                        className="p-3"
                                        style={{
                                            maxHeight: '12.5rem',
                                            objectFit: 'contain',
                                        }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{badge.name}</Card.Title>
                                        <Card.Text>
                                            {badge.description}
                                        </Card.Text>
                                        {userRole !== 'Mentor' ? (
                                            <div className="d-flex justify-content-between">
                                                <Button variant="danger" onClick={() => handleDelete(badge.id)}>
                                                    <i className='bi-trash' style={{color: 'white'}}></i> Delete
                                                </Button>
                                                <Button variant="primary" onClick={() => handleAddEdit(badge)}>
                                                    <i className='bi-pencil' style={{color: 'white'}}></i> Edit
                                                </Button>
                                            </div>
                                        ) : (
                                            <small>
                                                Achieved date: {' '} 
                                                {new Date(badge.achievedDate!).toLocaleString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                            </small>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))):(
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <Alert>Badges list is empty</Alert>
                            </div>
                        )}

                        {userRole == 'Mentor' && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="alert alert-primary text-center m-3">
                                Work hard to earn more badges and showcase your achievements!
                                </div>
                            </div>
                        )}
                </Row>

                {showForm && (
                    <BadgeForm
                        show={showForm}
                        onHide={handleCloseForm}
                        onSuccess={fetchBadges}
                        badge={editingBadge || undefined}
                    />
                )}
            </Container>
        </>
    );
};

export default Badge;