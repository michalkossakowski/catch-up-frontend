import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import axiosInstance from '../../../axiosConfig';
import { BadgeDto } from '../../dtos/BadgeDto';
import Loading from '../Loading/Loading';

const Badge: React.FC = () => {
    const [badges, setBadges] = useState<BadgeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBadge, setSelectedBadge] = useState<BadgeDto | null>(null);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const response = await axiosInstance.get<BadgeDto[]>('/Badge/GetAll');
            setBadges(response.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch badges');
            setLoading(false);
        }
    };

    const handleBadgeClick = (badge: BadgeDto) => {
        setSelectedBadge(badge);
    };

    const handleCloseModal = () => {
        setSelectedBadge(null);
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
            <h2 className="text-center my-4">Badges</h2>
            <Row xs={1} md={3} className="g-4">
                {badges.map((badge) => (
                    <Col key={badge.id}>
                        <Card 
                            className="h-100 badge-card" 
                            onClick={() => handleBadgeClick(badge)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Img 
                                variant="top" 
                                src={badge.iconSource || 'https://via.placeholder.com/150'} 
                                className="p-3"
                                style={{ 
                                    maxHeight: '200px', 
                                    objectFit: 'contain' 
                                }}
                            />
                            <Card.Body>
                                <Card.Title>{badge.name}</Card.Title>
                                <Card.Text className="text-muted">
                                    {badge.count ? `Unlock at: ${badge.count}` : 'Special Badge'}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedBadge && (
                <Modal show={!!selectedBadge} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedBadge.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center mb-3">
                            <img 
                                src={selectedBadge.iconSource || 'https://via.placeholder.com/250'} 
                                alt={selectedBadge.name} 
                                style={{ 
                                    maxWidth: '250px', 
                                    maxHeight: '250px', 
                                    objectFit: 'contain' 
                                }}
                            />
                        </div>
                        <p><strong>Description:</strong> {selectedBadge.description}</p>
                        {selectedBadge.count && (
                            <p>
                                <strong>Unlock Condition:</strong> 
                                {selectedBadge.countType ? `${selectedBadge.countType} at ${selectedBadge.count}` : ''}
                            </p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <style>{`
                .badge-card {
                    transition: transform 0.2s;
                }
                .badge-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
            `}</style>
        </Container>
    );
};

export default Badge;