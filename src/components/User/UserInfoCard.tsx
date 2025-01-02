import React, { useState } from "react";
import { Image } from "react-bootstrap";
import AvatarUploadModal from "../File/AvatarUploadModal";

interface UserInfoCardProps {
    name: string | undefined;
    surname: string | undefined;
    position: string | undefined;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ name, surname, position }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <div className="p-4">
            <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                    <Image
                        src="src/assets/defaultUserIcon.jpg"
                        roundedCircle
                        width={128}
                        height={128}
                        className="bg-light cursor-pointer"
                        alt="User avatar"
                        onClick={() => setShowUploadModal(true)}
                        style={{ cursor: 'pointer' }}
                    />
                    <div
                        className="position-absolute bottom-0 right-0 p-1 bg-primary rounded-circle"
                        style={{
                            cursor: 'pointer',
                            right: '10px',
                            bottom: '5px'
                        }}
                        onClick={() => setShowUploadModal(true)}
                    >
                        <i className="bi bi-camera-fill text-white" style={{ fontSize: '14px' }} />
                    </div>
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
                currentAvatarUrl="src/assets/defaultUserIcon.jpg"
            />
        </div>
    );
};

export default UserInfoCard;