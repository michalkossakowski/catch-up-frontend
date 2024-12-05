import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getAllBadges, deleteBadge } from '../../services/badgeService';
import BadgeForm from './BadgeForm';
import { BadgeDto } from '../../dtos/BadgeDto';
import Loading from '../Loading/Loading';
import { BadgeTypeCountEnum } from '../../Enums/BadgeTypeCountEnum';

const Badge: React.FC = () => {
    const [badges, setBadges] = useState<BadgeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingBadge, setEditingBadge] = useState<BadgeDto | null>(null);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const data = await getAllBadges();
            setBadges(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch badges');
            setLoading(false);
        }
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
        return (BadgeTypeCountEnum[countType]+": ") || 'Unknown';
    };

    const handleCloseForm = () => {
        setEditingBadge(null);
        setShowForm(false);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <div className="alert alert-danger">{error}</div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h2>Badges</h2>
                <Button variant="primary" onClick={() => handleAddEdit()}>
                    Add Badge
                </Button>
            </div>
            <Row xs={1} md={3} className="g-4">
                {badges.map((badge) => (
                    <Col key={badge.id}>
                        <Card className="h-100">
                            {badge.iconSource ? (
                                <Card.Img
                                    variant="top"
                                    src={badge.iconSource}
                                    className="p-3"
                                    style={{
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <div
                                    className="placeholder col-6"
                                    style={{
                                        height: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#e9ecef',
                                        borderRadius: '.25rem',
                                    }}
                                >
                                </div>
                            )}
                            <Card.Body>
                                <Card.Title>{badge.name}</Card.Title>
                                <Card.Text>{badge.description}</Card.Text>
                                <Card.Text>{getBadgeTypeName(badge.countType)}{badge.count}</Card.Text>
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