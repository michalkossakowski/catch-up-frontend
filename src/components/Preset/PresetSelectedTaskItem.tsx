import React from 'react';
import { Button } from 'react-bootstrap';
import { TaskContentDto } from '../../dtos/TaskContentDto';

interface PresetSelectedTaskItemProps {
	item: TaskContentDto;
	onRemove: (id: number) => void;
}

const PresetSelectedTaskItem: React.FC<PresetSelectedTaskItemProps> = ({ item, onRemove }) => {
	return (
		<div
			className="d-flex align-items-center justify-content-between rounded px-2 py-1 mb-2"
			style={{
				backgroundColor: 'var(--bs-tertiary-bg)',
				color: 'var(--bs-body-color)',
				border: '1px solid var(--bs-border-color)'
			}}
		>
			<div className="text-truncate me-2" title={item.title}>
				{item.title}
			</div>
			<Button variant="outline-danger" size="sm" onClick={() => onRemove(item.id)}>
				<i className="bi bi-x" />
			</Button>
		</div>
	);
};

export default PresetSelectedTaskItem;
