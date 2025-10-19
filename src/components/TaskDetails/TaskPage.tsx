import { useParams } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { TaskCommentDto } from '../../dtos/TaskCommentDto';
import { TaskTimeLogDto } from '../../dtos/TaskTimeLogDto';
import { GetFullTaskData,setTaskStatus } from '../../services/taskService';
import { Alert, Dropdown, Tab, Tabs, Form, Pagination, Button } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import { StatusEnum } from '../../Enums/StatusEnum';
import './TaskPage.css';
import MaterialItem from '../MaterialManager/MaterialItem';
import TaskComment from './TaskComment'; 
import TaskTimeLog from './TaskTimeLog';
import TaskCommentModal from './TaskCommentModal';
import TaskTimeLogModal from './TaskTimeLogModal';
import TaskCommentService from '../../services/taskCommentService';
import TaskTimeLogService from '../../services/taskTimeLogService';
import ConfirmModal from '../Modal/ConfirmModal';


const TaskPage = () => {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [timeLogLoading, setTimeLogLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [fullTask, setTask] = useState<FullTaskDto | null>(null)
    const [taskComments, setTaskComments] = useState<TaskCommentDto[]>([]);
    const [taskTimeLogs, setTaskTimeLogs] = useState<TaskTimeLogDto[]>([]);

    const [commentsTotalCount, setCommentsTotalCount] = useState(0);
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const [itemsPerCommentPage, setItemsPerCommentPage] = useState(5);
    const totalCommentPages = Math.ceil(commentsTotalCount / itemsPerCommentPage);

    const [timeLogTotalCount, setTimeLogTotalCount] = useState(0);
    const [currentTimeLogPage, setCurrentTimeLogPage] = useState(1);
    const [itemsPerTimeLogPage, setItemsPerTimeLogPage] = useState(5);
    const totalTimeLogPages = Math.ceil(timeLogTotalCount / itemsPerTimeLogPage);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [isTimeLogEnabled, setIsTimeLogEnabled] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<'deleteComment' | 'deleteTimeLog' | null>(null);

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [commentModalData, setCommentModalData] = useState<TaskCommentDto | undefined>(undefined);

    const [showTimeLogtModal, setShowTimeLogModal] = useState(false);
    const [timeLogModalData, setTimeLogModalData] = useState<TaskTimeLogDto | undefined>(undefined);

    interface StatusInfo {
        label: string;
        color: string;
      }
      
      const statusLabels: Record<StatusEnum, StatusInfo> = {
        [StatusEnum.ToDo]: { label: "To Do", color: "to-do-status" },
        [StatusEnum.InProgress]: { label: "In Progress", color: "in-progress-status" },
        [StatusEnum.ToReview]: { label: "To Review", color: "review-status" },
        [StatusEnum.ReOpen]: { label: "Reopen", color: "reopened-status" },
        [StatusEnum.Done]: { label: "Done", color: "done-status" },
      };

    useEffect(() => {
        fetchTask();
    },[]);
    
    useEffect(() => {
        if (fullTask !== null) {
            fetchComments();
        }
    }, [currentCommentPage, itemsPerCommentPage]);
    useEffect(() => {
        if (fullTask !== null) {
            fetchTimeLogs();
        }
    }, [currentTimeLogPage, itemsPerTimeLogPage]);

    const fetchComments = () => {
        setCommentLoading(true);
        TaskCommentService.getTaskCommentsByTaskId(Number(id), currentCommentPage, itemsPerCommentPage)
            .then((response) => {
                setTaskComments(response.comments);
                setCommentsTotalCount(response.totalCount);
            })
            .catch((error) => {
                setAlertMessage('Error: ' + error.message);
                //setShowAlert(true); // Show alert on error
            })
            .finally(() => setCommentLoading(false));
            
    };
    const fetchTimeLogs = () => {
        TaskTimeLogService.getTaskTimeLogsByTaskId(Number(id), currentTimeLogPage, itemsPerTimeLogPage)
            .then((response) => {
                setTaskTimeLogs(response.timeLogs);
                setHours(Number(response.hours));
                setMinutes(Number(response.minutes));
                setTimeLogTotalCount(response.totalCount);
            })
            .catch((error) => {
                setAlertMessage('Error: ' + error.message);
            })
    };
    const fetchTask =  () =>{
        setLoading(true);
        GetFullTaskData(Number(id))
            .then((response) => {   
                setTask(response.fullTask);
                setTaskComments(response.comments);
                setTaskTimeLogs(response.timelogs);
                setCommentsTotalCount(response.commentsTotalCount);
                setTimeLogTotalCount(response.timeLogTotalCount);
                setHours(response.hours);
                setMinutes(response.minutes);
                setIsTimeLogEnabled(response.isTimeLogEnabled);
            })
            .catch((error) => {
                setAlertMessage('Error: ' + error.message);
                setShowAlert(true); 
            })
            .finally(() => setLoading(false));
        setLoading(false);
    }
    const formatDate = (date?: Date | null) => {
        if (date == null) {
            return "N/A";
        }
        return new Date(date).toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',});
    };
    const handleStatusChange = (newStatus: StatusEnum) => {
        if (fullTask) {
            setTaskStatus(fullTask.id as number, newStatus)
                .then((response) => {
                    setTask(response as FullTaskDto);
                    setShowAlert(false); 
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true); 
                })
                .finally(() =>{ 
                    setTask({ ...fullTask, status: newStatus } as FullTaskDto);
                });
        }
           
    }
    const handleCommentPageChange = (pageNumber: number) => {
        setCurrentCommentPage(pageNumber);
        const tabElement = document.querySelector('.nav-tabs');
        if (tabElement) {
            const rect = (tabElement as HTMLElement).getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top;
            window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
            });
        }
    };
    
    const handleCommentPageSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPage = Number(e.target.value);
        handleCommentPageChange(newPage);
    };
    const handleItemsPerCommentPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerCommentPage(Number(e.target.value));
        setCurrentCommentPage(1);
    };
    const renderCommentPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentCommentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalCommentPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handleCommentPageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentCommentPage}
                    onClick={() => handleCommentPageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalCommentPages) {
            if (endPage < totalCommentPages - 1) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items.push(
                <Pagination.Item key={totalCommentPages} onClick={() => handleCommentPageChange(totalCommentPages)}>
                    {totalCommentPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    const handleTimeLogPageChange = (pageNumber: number) => {
        setCurrentTimeLogPage(pageNumber);
        const tabElement = document.querySelector('.nav-tabs');
        if (tabElement) {
            const rect = (tabElement as HTMLElement).getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top;
            window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
            });
        }
    };
    const handleTimeLogPageSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPage = Number(e.target.value);
        handleTimeLogPageChange(newPage);
    };
    const handleItemsPerTimeLogPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerTimeLogPage(Number(e.target.value));
        setCurrentTimeLogPage(1);
    };
    const renderTimeLogPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentTimeLogPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalTimeLogPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handleTimeLogPageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentTimeLogPage}
                    onClick={() => handleTimeLogPageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalTimeLogPages) {
            if (endPage < totalTimeLogPages - 1) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items.push(
                <Pagination.Item key={totalTimeLogPages} onClick={() => handleCommentPageChange(totalTimeLogPages)}>
                    {totalTimeLogPages}
                </Pagination.Item>
            );
        }

        return items;
    };
    const commentDelete = (commentId: number) => {
        setIdToDelete(commentId);
        setModalTitle("Delete Comment");
        setDeleteTarget('deleteComment');
        setConfirmMessage("Are you sure you want to delete this comment?");
        setShowConfirmModal(true);
    };
    const handleDeleteComment = () => {
        if (idToDelete) {
            TaskCommentService.deleteTaskComment(idToDelete)
                .then(() => {
                    
                    fetchComments(); // Refresh comments after deletion
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true); // Show alert on error
                });
            setShowConfirmModal(false);
        }
    };
    const handleDeleteTimeLog = () => {
        if (idToDelete) {
            TaskTimeLogService.deleteTaskTimeLog(idToDelete)
                .then(() => {
                    fetchTimeLogs();
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true);
                });
        }
    };

    const timeLogDelete = (timeLogId: number) => {
        setIdToDelete(timeLogId);
        setDeleteTarget('deleteTimeLog');
        setModalTitle("Delete Time Log");
        setConfirmMessage("Are you sure you want to delete this time log?");
        setShowConfirmModal(true);
    }
    const confirmHandler = () => {
        if (deleteTarget === 'deleteComment') {
            handleDeleteComment();
        }
        else if (deleteTarget === 'deleteTimeLog') {
            handleDeleteTimeLog();
        }
        setDeleteTarget(null);
        setShowConfirmModal(false);
        
    }

    const handleShowCommentModal = (commentData?: TaskCommentDto) => {
        setCommentModalData(commentData);
        setShowCommentModal(true);
    };
    const handleCloseCommentModal = () => {
        setShowCommentModal(false);
        setCommentModalData(undefined);
    };
    const handleSaveComment = (commentData: TaskCommentDto) => {
        if (commentData.id) {
            TaskCommentService.patchTaskComment(commentData)
                .then(() => {
                    fetchComments(); 
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true);
                });
        } else {
            TaskCommentService.addTaskComment(commentData)
                .then(() => {
                    fetchComments();
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true);
                });
        }
        handleCloseCommentModal();
    };
    const handleShowTimeLogModal = (timeLogData?: TaskTimeLogDto) => {
        setTimeLogModalData(timeLogData);
        setShowTimeLogModal(true);
    };
    const handleCloseTimeLogModal = () => {
        setShowTimeLogModal(false);
        setTimeLogModalData(undefined);
    };
    const handleSaveTimeLog = (commentData: TaskCommentDto) => {
        if (commentData.id) {
            TaskTimeLogService.editTaskTimeLog(commentData)
                .then(() => {
                    fetchTimeLogs();
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true);
                });
        } else {
            TaskTimeLogService.addTaskTimeLog(commentData)
                .then(() => {
                    fetchTimeLogs();
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true); 
                });
        }
        handleCloseTimeLogModal();
    };
return (
    <>
        {!showAlert && !loading && fullTask && (
            
            <><div className='taskDetails'>
                <div className='taskDetailsHeader'>
                    <h1>{fullTask.title}</h1>
                    <div className='taskDetailsHeaderButtons'>
                        <Dropdown className='dropdown'>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className={`custom-dropdown-toggle ${statusLabels[fullTask.status as StatusEnum]?.color}`}>
                                {statusLabels[fullTask.status as StatusEnum]?.label || 'Select Status'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {Object.entries(statusLabels).map(([key, { label, color }], idx, arr) => (
                                    <>
                                        <Dropdown.Item
                                            key={key}
                                            onClick={() => handleStatusChange(Number(key) as StatusEnum)}
                                            className={color + ' custom-dropdown-item'}
                                        >
                                            {label}
                                        </Dropdown.Item>
                                        {idx < arr.length - 1 && <Dropdown.Divider key={`divider-${key}`} />}
                                    </>
                                ))}

                            </Dropdown.Menu>
                        </Dropdown>
                        <Button variant="primary" onClick={()=>handleShowCommentModal()}>Add comment</Button>
                        { isTimeLogEnabled &&(
                            <Button variant="secondary" onClick={()=>handleShowTimeLogModal()}>Log time</Button>
                        )}
                        
                    </div>
                </div>
                <div className='taskDetailsContent'>
                    <div className='column description'>
                        <b>Description:</b>
                        <p>{fullTask.description}</p>
                        {fullTask.materialsId && (
                            <div>
                                <MaterialItem
                                    materialId={fullTask.materialsId}
                                    enableDownloadFile={true}
                                    enableAddingFile={false}
                                    enableRemoveFile={false}
                                    enableEdittingMaterialName={false}
                                    enableEdittingFile={false}
                                    showMaterialName={true}
                                    nameTitle='See Materials' />
                            </div>
                        )}
                    </div>
                    <div className='column addittionalInfo'>
                        <div className='data-row '>
                            <div className="label">Assigner:</div>
                            <div className="value">{fullTask.assigningName}</div>
                        </div>
                        <div className='data-row '>
                            <div className="label">Assignee:</div>
                            <div className="value">{fullTask.newbieName}</div>
                        </div>
                        <div className='data-row '>
                            <div className="label">Assignment Date:</div>
                            <div className="value">{formatDate(fullTask.assignmentDate)}</div>
                        </div>
                        <div className='data-row '>
                            <div className="label">Finalization Date:</div>
                            <div className="value">{formatDate(fullTask.finalizationDate)}</div>
                        </div>
                        <div className='data-row '>
                            <div className="label">Deadline:</div>
                            <div className="value">{formatDate(fullTask.deadline)}</div>
                        </div>
                        { isTimeLogEnabled && (
                            <div className='data-row '>
                                <div className="label">Spend Time:</div>
                                <div className="value">{hours} h {minutes} m</div>
                            </div>
                        )}
                        
                    </div>
                </div>
                <Tabs
                    defaultActiveKey="comments"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    >
                    <Tab eventKey="comments" title={`Comments (${commentsTotalCount})`}>
                        {commentsTotalCount==0 &&(
                            <div className='alert alert-info'>No comments yet.</div>
                        )}
                        {!loading && !commentLoading && !showAlert && commentsTotalCount>0 && (
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <Form.Group controlId="itemsPerPage" className="d-flex align-items-center mx-3">
                                    <Form.Label className="me-2 mb-0">Comments per page:</Form.Label>
                                    <Form.Select 
                                        value={itemsPerCommentPage}
                                        onChange={handleItemsPerCommentPageChange}
                                        style={{ width: 'auto' }}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="pageSelect" className="d-flex align-items-center mx-3">
                                    <Form.Label className="me-2 mb-0">Page:</Form.Label>
                                    <Form.Select
                                        value={currentCommentPage}
                                        onChange={handleCommentPageSelectChange}
                                        style={{ width: 'auto' }}
                                    >
                                        {Array.from({ length: totalCommentPages }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        )}
                        {taskComments.map((comment,index) => (
                            <TaskComment key={comment.id} taskComment={comment} deleteClick={commentDelete} editClick={handleShowCommentModal}/>
                        ))}
                        {totalCommentPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <Pagination className="mb-0">
                                    <Pagination.Prev
                                        onClick={() => handleCommentPageChange(currentCommentPage - 1)}
                                        disabled={currentCommentPage === 1}
                                    />
                                    {renderCommentPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handleCommentPageChange(currentCommentPage + 1)}
                                        disabled={currentCommentPage === totalCommentPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                        {commentLoading && (
                            <div className='loaderBox'>
                                <Loading/>
                            </div>
                        )}
                    </Tab>
                    <Tab eventKey="timeLogs" title={`Time logs (${timeLogTotalCount})`} disabled={!isTimeLogEnabled}>
                        {timeLogTotalCount==0 &&(
                            <div className='alert alert-info'>No time logs yet.</div>
                        )}
                        {!timeLogLoading && isTimeLogEnabled && !loading && !showAlert && timeLogTotalCount>0 && (
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <Form.Group controlId="itemsPerTimeLogPage" className="d-flex align-items-center mx-3">
                                    <Form.Label className="me-2 mb-0">Time logs per page:</Form.Label>
                                    <Form.Select 
                                        value={itemsPerTimeLogPage}
                                        onChange={handleItemsPerTimeLogPageChange}
                                        style={{ width: 'auto' }}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="TimeLogPageSelect" className="d-flex align-items-center mx-3">
                                    <Form.Label className="me-2 mb-0">Page:</Form.Label>
                                    <Form.Select
                                        value={currentTimeLogPage}
                                        onChange={handleTimeLogPageSelectChange}
                                        style={{ width: 'auto' }}
                                    >
                                        {Array.from({ length: totalTimeLogPages }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        )}
                        {taskTimeLogs.map((timeLog,index) => (
                            <TaskTimeLog key={timeLog.id} taskTimeLog={timeLog} newbieId={fullTask.newbieId} deleteClick={timeLogDelete} editClick={handleShowTimeLogModal}/>
                        ))}
                        {totalTimeLogPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <Pagination className="mb-0">
                                    <Pagination.Prev
                                        onClick={() => handleTimeLogPageChange(currentTimeLogPage - 1)}
                                        disabled={currentTimeLogPage === 1}
                                    />
                                    {renderTimeLogPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handleTimeLogPageChange(currentTimeLogPage + 1)}
                                        disabled={currentTimeLogPage === totalTimeLogPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </Tab>
                    {timeLogLoading && (
                        <div className='loaderBox'>
                            <Loading/>
                        </div>
                    )}
                </Tabs>
            </div>
            
            </>
        )}
        
        {loading && (
            <div className='loaderBox'>
                <Loading/>
            </div>
        )}
        {showAlert && (
            <div className='alertBox'>
                <Alert className='alert' variant='danger'>
                    {alertMessage}
                </Alert>
            </div>
        )}
        <ConfirmModal 
            show={showConfirmModal} 
            title={modalTitle}
            message={confirmMessage}
            onConfirm={confirmHandler} 
            onCancel={() => setShowConfirmModal(false)} 
        />
        <TaskCommentModal 
            show={showCommentModal} 
            taskId={Number(id)} 
            handleClose={handleCloseCommentModal} 
            handleSave={handleSaveComment} 
            initialData={commentModalData}
        />
        <TaskTimeLogModal 
            show={showTimeLogtModal} 
            taskId={Number(id)} 
            handleClose={handleCloseTimeLogModal} 
            handleSave={handleSaveTimeLog} 
            initialData={timeLogModalData}
        />  
    </>
    
    
    );
};

export default TaskPage;