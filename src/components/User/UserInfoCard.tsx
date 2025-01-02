import React, { useState } from "react";
import { Image } from "react-bootstrap";
import AvatarUploadModal from "../File/AvatarUploadModal";
import { useAuth } from "../../Provider/authProvider.tsx";
import './UserInfoCard.css';

interface UserInfoCardProps {
    name: string | undefined;
    surname: string | undefined;
    position: string | undefined;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ name, surname, position }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const { avatar } = useAuth();

    return (
        <div className="p-4">
            <div className="d-flex align-items-center gap-3">
                <div
                    className="position-relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={avatar || 'src/assets/defaultUserIcon.jpg'}
                        roundedCircle
                        width={128}
                        height={128}
                        className="bg-light cursor-pointer image-padding-cover"
                        alt="User avatar"
                    />
                    {isHovering && (
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

            <AvatarUploadModal
                show={showUploadModal}
                onHide={() => setShowUploadModal(false)}
            />
        </div>
    );
};

export default UserInfoCard;
