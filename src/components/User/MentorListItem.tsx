interface MentorListItemProps {
    name: string;
    surname: string;
    position: string;
}

const MentorListItem = ({ name, surname, position }: MentorListItemProps) => {
    return (
        <div className="d-flex align-items-center p-3 border rounded mb-2">
            <img
                src="src/assets/defaultUserIcon.jpg" // user profile pictures not implemented yet!
                className="rounded-circle bg-light"
                width={48}
                height={48}
                alt={`${name} ${surname}`}
            />
            <div className="ms-3 d-flex align-items-center justify-content-between flex-grow-1">
                <div>
                    <div className="text-start">{name} {surname}</div>
                    <div className="text-muted text-start">{position}</div>
                </div>
            </div>
        </div>
    );
};

export default MentorListItem;