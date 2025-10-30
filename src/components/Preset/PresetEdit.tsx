import React, { useState, useEffect } from 'react';
import { PresetDto } from '../../dtos/PresetDto';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { TaskPresetDto } from '../../dtos/TaskPresetDto';
import { Button, Form } from 'react-bootstrap';
import { getAllTaskContents } from '../../services/taskContentService';
import { addPreset, editPreset } from '../../services/presetService';
import { addTaskPreset, removeTaskFromPreset, getTaskPresetsByPreset } from '../../services/taskPresetService';
import { Autocomplete, TextField, Chip } from '@mui/material';
import './PresetEdit.css';
import { useAuth } from '../../Provider/authProvider';
import NotificationToast from '../Toast/NotificationToast';
import PresetSelectedTaskItem from './PresetSelectedTaskItem';

interface PresetEditProps {
	preset?: PresetDto;
	isEditMode: boolean;
	onPresetEdited: () => void;
	existingTaskContents?: TaskPresetDto[];
	onCancel?: () => void;
}

const PresetEdit: React.FC<PresetEditProps> = ({ preset, isEditMode, onPresetEdited, existingTaskContents = [], onCancel }) => {
	const [name, setName] = useState<string>('');
	const [selectedTasks, setSelectedTasks] = useState<TaskContentDto[]>([]);
	const [availableTasks, setAvailableTasks] = useState<TaskContentDto[]>([]);
	const [currentPresetTasks, setCurrentPresetTasks] = useState<TaskContentDto[]>([]);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [toastColor, setToastColor] = useState('');
	const { user } = useAuth();

	useEffect(() => {
		if (preset) {
			setName(preset.name);
			loadCurrentPresetTasks(preset.id);
		}
		loadAvailableTasks();
	}, [preset]);

	const loadCurrentPresetTasks = async (presetId: number) => {
		try {
			const allTasks = await getAllTaskContents();
			const presetTaskPresets = await getTaskPresetsByPreset(presetId);
			
			const presetTaskIds = presetTaskPresets.map(tp => tp.taskContentId);
			const presetTasks = allTasks.filter(task => presetTaskIds.includes(task.id));
			
			setCurrentPresetTasks(presetTasks);
			setSelectedTasks(presetTasks);
		} catch (error: any) {
			console.error('Error loading current preset tasks:', error);
			setToastMessage('Error loading current preset tasks');
			setToastColor('red');
			setShowToast(true);
		}
	};

	const loadAvailableTasks = async () => {
		try {
			const tasks = await getAllTaskContents();
			
			if (isEditMode && preset) {
				setAvailableTasks(tasks);
			} else {				
				const existingTaskIds = existingTaskContents?.map(tp => tp.taskContentId) || [];
				const filteredTasks = tasks.filter(task => !existingTaskIds.includes(task.id));
				setAvailableTasks(filteredTasks);
			}
		} catch (error: any) {
			console.error('Error loading tasks:', error);
			setToastMessage('Error loading available tasks');
			setToastColor('red');
			setShowToast(true);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!user?.id) {
				setToastMessage("User must be logged in");
				setToastColor('red');
				setShowToast(true);
				throw new Error('User not authenticated');
			}

			if (name.trim() === '') {
				setToastMessage("Preset name is required");
				setToastColor('red');
				setShowToast(true);
				return;
			}

			const presetDto: PresetDto = {
				id: isEditMode ? preset!.id : 0,
				name: name,
				creatorId: user.id
			};

			let response;
			if (isEditMode) {
				response = await editPreset(presetDto);
			} else {
				response = await addPreset(presetDto);
			}
			
			const presetId = isEditMode ? preset!.id : response.id;
			
			if (!presetId) {
				setToastMessage('Failed to save preset');
				setToastColor('red');
				setShowToast(true);
				throw new Error('Failed to get preset ID from response');
			}

			if (isEditMode) {
				try {
					const existingTaskPresets = await getTaskPresetsByPreset(presetId);
					const existingTaskIds = existingTaskPresets.map(tp => tp.taskContentId);
					const selectedTaskIds = selectedTasks.map(task => task.id);
					
					for (const task of selectedTasks) {
						if (!existingTaskIds.includes(task.id)) {
							const taskPresetDto: TaskPresetDto = {
								presetId: presetId,
								taskContentId: task.id
							};
							await addTaskPreset(taskPresetDto);
						}
					}
					
					const tasksToRemove = existingTaskIds.filter(id => !selectedTaskIds.includes(id));
					
					for (const taskId of tasksToRemove) {
						await removeTaskFromPreset(presetId, taskId);
					}
				} catch (error: any) {
					for (const task of selectedTasks) {
						const taskPresetDto: TaskPresetDto = {
							presetId: presetId,
							taskContentId: task.id
						};
						await addTaskPreset(taskPresetDto);
					}
				}
			} else {
				for (const task of selectedTasks) {
					const taskPresetDto: TaskPresetDto = {
						presetId: presetId,
						taskContentId: task.id
					};
					await addTaskPreset(taskPresetDto);
				}
			}

			onPresetEdited();
			
			if (!isEditMode) {
				setName('');
				setSelectedTasks([]);
			}
			
		} catch (error: any) {
			console.error('Error details:', error);
			setToastMessage(`Failed to save preset`);
			setToastColor('red');
			setShowToast(true);
		}
	};

	return (
		<section className='editBox'>
			<Form onSubmit={handleSubmit}>
				<h2>{isEditMode ? 'Edit Preset' : 'Create New Preset'}</h2>
				
				<Form.Group className="mb-3">
					<Form.Label>Preset Name</Form.Label>
					<Form.Control
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-2">
					<Form.Label>Select Tasks</Form.Label>
					<Autocomplete
						multiple
						options={availableTasks}
						getOptionLabel={(option) => option.title}
						value={selectedTasks}
						onChange={(_, newValue) => setSelectedTasks(newValue)}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="outlined"
								placeholder="Select tasks..."
								sx={{
									'& .MuiOutlinedInput-root': {
										'& fieldset': { borderColor: 'var(--bs-border-color)' },
										'&:hover fieldset': { borderColor: 'var(--bs-border-color)' },
										'&.Mui-focused fieldset': { borderColor: '#86b7fe' },
										'& input': { color: 'var(--bs-body-color)' }
									},
									'& .MuiOutlinedInput-input': { padding: '0.375rem 0.75rem', backgroundColor: 'var(--bs-body-bg)' }
								}}
							/>
						)}
						renderTags={() => null}
					/>
				</Form.Group>

				{selectedTasks.length > 0 && (
					<div className="mb-3">
						<div className="fw-semibold mb-2">Selected tasks</div>
						<div>
							{selectedTasks.map(tc => (
								<PresetSelectedTaskItem key={tc.id} item={tc} onRemove={(id) => setSelectedTasks(prev => prev.filter(x => x.id !== id))} />
							))}
						</div>
					</div>
				)}

				<div className="d-flex justify-content-end gap-2">
					{onCancel && (
						<Button type="button" variant="secondary" onClick={onCancel}>
							Cancel
						</Button>
					)}
					<Button type="submit" variant="primary">
						{isEditMode ? 'Save Changes' : 'Create Preset'}
					</Button>
				</div>
			</Form>
			
			<NotificationToast
				show={showToast}
				title="Preset Operation"
				message={toastMessage}
				color={toastColor}
				onClose={() => setShowToast(false)}
			/>
		</section>
	);
};

export default PresetEdit; 