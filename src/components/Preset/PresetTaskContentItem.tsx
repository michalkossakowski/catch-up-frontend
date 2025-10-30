import React from 'react';
import { TaskContentDto } from '../../dtos/TaskContentDto';

interface PresetTaskContentItemProps {
	item: TaskContentDto;
}

const PresetTaskContentItem: React.FC<PresetTaskContentItemProps> = ({ item }) => {
	return (
		<div className="border rounded p-2 mb-2" style={{ textAlign: 'left', backgroundColor: 'var(--bs-body-bg)' }}>
			<div className="fw-semibold mb-1">{item.title}</div>
			{item.description && (
				<div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{item.description}</div>
			)}
		</div>
	);
};

export default PresetTaskContentItem;
