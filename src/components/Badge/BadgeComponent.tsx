import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getAllBadges, deleteBadge, getByMentorId } from '../../services/badgeService';
import fileService from '../../services/fileService';
import BadgeForm from './BadgeForm';
import { BadgeDto } from '../../dtos/BadgeDto';
import Loading from '../Loading/Loading';
import { BadgeTypeCountEnum } from '../../Enums/BadgeTypeCountEnum';
import { getRole } from '../../services/userService';
import { useAuth } from '../../Provider/authProvider';
import defaultBadgeIcon from '../../assets/defaultBadgeIcon.png';

const Badge: React.FC = () => {
    const { user } = useAuth();
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
            const userRoleResponse = await getRole(user.id ?? 'defaultId');
            setUserRole(userRoleResponse);
            const data = userRoleResponse === 'Mentor' ? await getByMentorId() : await getAllBadges();
            if (!data || data.length === 0) {
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
                    // Użycie domyślnego obrazka w przypadku błędu
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
        return (BadgeTypeCountEnum[countType] + ': ') || 'Unknown';
    };

    const handleCloseForm = () => {
        setEditingBadge(null);
        setShowForm(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h2>Badges</h2>
                {userRole !== 'Mentor' && (
                    <Button variant="primary" onClick={() => handleAddEdit()}>
                        Add Badge
                    </Button>
                )}
            </div>
            {error && (
                <div className="mb-3">
                    <div className="alert alert-danger text-center">{error}</div>
                </div>
            )}
            <Row xs={1} md={3} className="g-4">
                {badges &&
                    badges.map((badge) => (
                        <Col key={badge.id}>
                            <Card className="h-100">
                                <Card.Img
                                    variant="top"
                                    src={badge.iconId ? imageUrls.get(badge.iconId) || defaultBadgeIcon : defaultBadgeIcon}
                                    className="p-3"
                                    style={{
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                    }}
                                />
                                <Card.Body>
                                    <Card.Title>{badge.name}</Card.Title>
                                    <Card.Text>{badge.description}</Card.Text>
                                    <Card.Text>
                                        {getBadgeTypeName(badge.countType)}
                                        {badge.count}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button variant="info" onClick={() => handleAddEdit(badge)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(badge.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
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
    );
};

export default Badge;