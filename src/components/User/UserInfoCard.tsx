import React, { useState } from "react";
import { Image } from "react-bootstrap";
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
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({name, surname, position, canEdit = false, avatarUrl}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const { avatar } = useAuth();

    const displayAvatar = canEdit ? (avatar || defaultUserIcon) :
        (avatarUrl || defaultUserIcon);

    return (
        <div className="p-4">
            <div className="d-flex align-items-center gap-3">
                <div
                    className="position-relative"
                    onMouseEnter={() => canEdit && setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={displayAvatar}
                        roundedCircle
                        width={128}
                        height={128}
                        className={`bg-light ${canEdit ? 'cursor-pointer' : ''} image-padding-cover`}
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

                <div className="text-start">
                    <h2 className="mb-1">
                        {name} {surname}
                    </h2>
                    <p className="mb-0 text-start">{position}</p>
                </div>
            </div>

            {canEdit && (
                <AvatarUploadModal
                    show={showUploadModal}
                    onHide={() => setShowUploadModal(false)}
                />
            )}
        </div>
    );
};

export default UserInfoCard;