import React, {useState, useEffect, useCallback} from 'react';
import { useDrag } from 'react-dnd';
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { StatusEnum } from "../../Enums/StatusEnum";

interface TaskPoolProps {
    taskContents?: TaskContentDto[];
    categories?: CategoryDto[];
    selectedCategoryId: number;
    onTaskDrop: (taskContentId: number, newStatus: StatusEnum) => void;
}

interface PoolTaskCardProps {
    task: TaskContentDto;
    categoryName: string;
}

// Individual draggable task card in the pool
const PoolTaskCard: React.FC<PoolTaskCardProps> = ({ task, categoryName }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, type: 'poolTask' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const dragRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                drag(node);
            }
        },
        [drag]
    );

    return (
        <div
            ref={dragRef}
            className={`pool-task-card card mb-2 shadow-sm ${isDragging ? 'opacity-50' : ''}`}
            style={{ cursor: 'grab' }}
        >
            <div className="card-body p-2">
                <h6 className="card-title mb-1">{task.title}</h6>
                <div className="d-flex justify-content-between align-items-center">
                    <small className="badge bg-info text-white">{categoryName}</small>
                </div>
            </div>
        </div>
    );
};

const TaskPool: React.FC<TaskPoolProps> = ({
                                               taskContents = [],
                                               categories = [],
                                               selectedCategoryId,
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

    return (
        <div className="task-pool card p-3 rounded shadow-sm" style={{height: '700px'}}>
            <h5 className="mb-3">Task Pool</h5>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search pool..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="category-filters mb-3">
                <div className="d-flex flex-wrap gap-2">
                    <button
                        className={`btn btn-sm ${activeCategoryId === 0 ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveCategoryId(0)}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`btn btn-sm ${activeCategoryId === category.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveCategoryId(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
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