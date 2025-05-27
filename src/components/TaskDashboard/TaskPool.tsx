import React, { useState, useEffect } from 'react';
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { Dropdown, Pagination } from 'react-bootstrap';
import PoolTaskCard from './PoolTaskCard';
import {getTaskContents} from "../../services/taskContentService.ts";

interface TaskPoolProps {
    taskContents?: TaskContentDto[];
    categories?: CategoryDto[];
    isDisabled?: boolean;
}

const TaskPool: React.FC<TaskPoolProps> = ({
                                               categories = [],
                                               isDisabled = false,
                                           }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTasks, setFilteredTasks] = useState<TaskContentDto[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number>(0);
    const [taskContents, setTaskContents] = useState<TaskContentDto[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [taskCache, setTaskCache] = useState<Record<number, TaskContentDto[]>>({});
    const tasksPerPage = 5;

    useEffect(() => {
        const fetchTaskContents = async () => {
            if (taskCache[currentPage]) {
                setTaskContents(taskCache[currentPage]);
                return;
            }

            try {
                setLoading(true);
                const result = await getTaskContents(currentPage, tasksPerPage);
                setTaskContents(result.taskContents);
                setTotalCount(result.totalCount);
                setTaskCache(prev => ({
                    ...prev,
                    [currentPage]: result.taskContents
                }));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching task contents:", error);
                setLoading(false);
            }
        };

        fetchTaskContents();
    }, [currentPage]);

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

    const totalPages = Math.ceil(totalCount / tasksPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        const items = [];

        items.push(
            <Pagination.First
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isDisabled || loading}
            />
        );
        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isDisabled || loading}
            />
        );

        let startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                    disabled={isDisabled || loading}
                >
                    {i}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0 || isDisabled || loading}
            />
        );
        items.push(
            <Pagination.Last
                key="last"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0 || isDisabled || loading}
            />
        );

        return items;
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
                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-muted text-center py-3">
                        No tasks available
                    </div>
                ) : (
                    <>
                        <div className="row g-2">
                            {filteredTasks.map(task => (
                                <div key={task.id} className="col-12">
                                    <PoolTaskCard
                                        task={task}
                                        categoryName={getCategoryName(task.categoryId!)!}
                                        isDisabled={isDisabled}
                                    />
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination size="sm">{renderPaginationItems()}</Pagination>
                            </div>
                        )}

                        <div className="text-muted text-center mt-2 small">
                            Showing {Math.min(totalCount, (currentPage - 1) * tasksPerPage + 1)}-
                            {Math.min(totalCount, currentPage * tasksPerPage)} of {totalCount} tasks
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskPool;