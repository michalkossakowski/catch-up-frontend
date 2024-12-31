import React from "react";
import { Image } from "react-bootstrap";

interface UserInfoCardProps {
    name: string | undefined;
    surname: string | undefined;
    position: string | undefined;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ name, surname, position }) => {
    return (
        <div className="p-4">
            <div className="d-flex align-items-center gap-3">
                <div>
                    <Image
                        src="src/assets/defaultUserIcon.jpg" // user profile pictures not implemented yet!
                        roundedCircle
                        width={128}
                        height={128}
                        className="bg-light"
                        alt="User avatar"
                    />
                </div>

                <div className="text-start">
                    <h2 className="mb-1">
                        {name} {surname}
                    </h2>
                    <p className="mb-0 text-start">{position}</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;
