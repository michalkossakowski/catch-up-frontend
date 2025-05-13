import React, { useState } from "react";
import { Image, Card } from "react-bootstrap";
import AvatarUploadModal from "../File/AvatarUploadModal";
import { useAuth } from "../../Provider/authProvider";
import defaultUserIcon from '../../assets/defaultUserIcon.jpg';
import './UserInfoCard.css';

interface UserInfoCardProps {
    name: string | undefined;
    surname: string | undefined;
    position: string | undefined;
    canEdit?: boolean;
    avatarUrl?: string | null;
    compact?: boolean;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
    name, 
    surname, 
    position, 
    canEdit = false, 
    avatarUrl,
    compact = false
}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const { avatar } = useAuth();

    const displayAvatar = canEdit ? (avatar || defaultUserIcon) :
        (avatarUrl || defaultUserIcon);

    if (compact) {
    return (
            <div className="text-center">
                <div
                    className="position-relative d-inline-block mb-2"
                    onMouseEnter={() => canEdit && setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={displayAvatar}
                        roundedCircle
                        width={120}
                        height={120}
                        className={`profile-avatar ${canEdit ? 'cursor-pointer' : ''}`}
                        alt="User avatar"
                    />
                    {canEdit && isHovering && (
                        <div
                            className="overlay position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center"
                            onClick={() => setShowUploadModal(true)}>
                            <i className="bi bi-camera-fill text-white fs-4"></i>
                        </div>
                    )}
                </div>

                <h4 className="mb-2">
                        {name} {surname}
                </h4>
                
                {position && (
                    <div className="badge rounded-pill profile-role-badge">
                        <i className="bi bi-person-badge me-1"></i>
                        {position}
                </div>
                )}

                {canEdit && (
                    <AvatarUploadModal
                        show={showUploadModal}
                        onHide={() => setShowUploadModal(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <Card className="mb-4">
            <Card.Body>
                <div className="d-flex align-items-center gap-4">
                    <div
                        className="position-relative"
                        onMouseEnter={() => canEdit && setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <Image
                            src={displayAvatar}
                            roundedCircle
                            width={150}
                            height={150}
                            className={`profile-avatar ${canEdit ? 'cursor-pointer' : ''} image-padding-cover`}
                            alt="User avatar"
                        />
                        {canEdit && isHovering && (
                            <div
                                className="overlay position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center"
                                onClick={() => setShowUploadModal(true)}>
                                <i className="bi bi-camera-fill text-white fs-3"></i>
                            </div>
                        )}
                    </div>

                    <div className="text-start profile-user-info">
                        <h1 className="profile-name mb-2">
                            {name} {surname}
                        </h1>
                        
                        {position && (
                            <div className="profile-badge">
                                <span className="badge rounded-pill profile-role-badge">
                                    <i className="bi bi-person-badge me-1"></i>
                                    {position}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Card.Body>

            {canEdit && (
                <AvatarUploadModal
                    show={showUploadModal}
                    onHide={() => setShowUploadModal(false)}
                />
            )}
        </Card>
    );
};

export default UserInfoCard;