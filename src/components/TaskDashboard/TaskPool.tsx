import React, { useState, useEffect } from 'react';
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { StatusEnum } from "../../Enums/StatusEnum";
import { Dropdown } from 'react-bootstrap';
import PoolTaskCard from './PoolTaskCard';

interface TaskPoolProps {
    taskContents?: TaskContentDto[];
    categories?: CategoryDto[];
    selectedCategoryId: number;
    onTaskDrop: (taskContentId: number, newStatus: StatusEnum) => void;
    isDisabled?: boolean;
}

const TaskPool: React.FC<TaskPoolProps> = ({
                                               taskContents = [],
                                               categories = [],
                                               selectedCategoryId,
                                               isDisabled = false,
                                           }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTasks, setFilteredTasks] = useState<TaskContentDto[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number>(0);

    // Filter tasks when search or category changes
    useEffect(() => {
        let filtered = [...taskContents];

        if (searchTerm.trim()) {
            filtered = filtered.filter(task =>
                task.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeCategoryId !== 0) {
            filtered = filtered.filter(task => task.categoryId === activeCategoryId);
        }

        setFilteredTasks(filtered);
    }, [searchTerm, activeCategoryId, taskContents]);

    // Update active category when selected category changes
    useEffect(() => {
        setActiveCategoryId(selectedCategoryId);
    }, [selectedCategoryId]);

    const getCategoryName = (categoryId?: number) => {
        if (!categoryId) return 'Uncategorized';
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    // Get active category name for dropdown display
    const getActiveCategoryName = () => {
        if (activeCategoryId === 0) return 'All Categories';
        return getCategoryName(activeCategoryId);
    };

    // Truncate text for dropdown if needed
    const truncateText = (text: string, maxLength: number) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div
            className={`task-pool card p-3 rounded shadow-sm ${isDisabled ? 'disabled-container' : ''}`}
            style={{
                opacity: isDisabled ? 0.6 : 1,
                position: 'relative'
            }}
        >
            {isDisabled && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(240, 240, 240, 0.3)',
                        zIndex: 10,
                        cursor: 'not-allowed'
                    }}
                />
            )}

            <h5 className="mb-3">Task Pool</h5>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search pool..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isDisabled}
                />
            </div>

            <div className="category-filters mb-3">
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id="category-dropdown"
                        className="w-100 text-truncate"
                        title={getActiveCategoryName()}
                        disabled={isDisabled}
                    >
                        {truncateText(getActiveCategoryName()!, 25)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                        <Dropdown.Item
                            active={activeCategoryId === 0}
                            onClick={() => setActiveCategoryId(0)}
                        >
                            All Categories
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        {categories.map(category => (
                            <Dropdown.Item
                                key={category.id}
                                active={activeCategoryId === category.id}
                                onClick={() => setActiveCategoryId(category.id)}
                                className="text-truncate"
                                title={category.name}
                            >
                                {category.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className="pool-tasks-container">
                {filteredTasks.length === 0 ? (
                    <div className="text-muted text-center py-3">
                        No tasks available
                    </div>
                ) : (
                    <div className="row g-2">
                        {filteredTasks.map(task => (
                            <div key={task.id} className="col-md-6">
                                <PoolTaskCard
                                    task={task}
                                    categoryName={getCategoryName(task.categoryId!)!}
                                    isDisabled={isDisabled}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskPool;