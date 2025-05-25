import { useParams } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { TaskCommentDto } from '../../dtos/TaskCommentDto';
import { TaskTimeLogDto } from '../../dtos/TaskTimeLogDto';
import { GetFullTaskData,setTaskStatus } from '../../services/taskService';
import { Alert, Dropdown, Tab, Tabs, Form, Pagination } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import { StatusEnum } from '../../Enums/StatusEnum';
import './TaskPage.css';
import MaterialItem from '../MaterialManager/MaterialItem';
import TaskComment from './TaskComment'; 
import TaskCommentService from '../../services/taskCommentService';
import { set } from 'date-fns';
const TaskPage = () => {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [fullTask, setTask] = useState<FullTaskDto | null>(null)
    const [taskComments, setTaskComments] = useState<TaskCommentDto[]>([]);
    const [taskTimeLogs, setTaskTimeLogs] = useState<TaskTimeLogDto[]>([]);

    const [commentsTotalCount, setCommentsTotalCount] = useState(0);
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const [itemsPerCommentPage, setItemsPerCommentPage] = useState(5);
    const [timeLogTotalCount, setTimeLogTotalCount] = useState(0);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [isTimeLogEnabled, setIsTimeLogEnabled] = useState(false);

    const totalPages = Math.ceil(commentsTotalCount / itemsPerCommentPage);

    interface StatusInfo {
        label: string;
        color: string;
      }
      
      const statusLabels: Record<StatusEnum, StatusInfo> = {
        [StatusEnum.ToDo]: { label: "To Do", color: "bg-secondary" },
        [StatusEnum.InProgress]: { label: "In Progress", color: "bg-primary" },
        [StatusEnum.ToReview]: { label: "To Review", color: "bg-warning" },
        [StatusEnum.ReOpen]: { label: "Reopen", color: "bg-danger" },
        [StatusEnum.Done]: { label: "Done", color: "bg-success" },
      };

    useEffect(() => {
        fetchTask();
    },[]);
    useEffect(() => {
        console.log('Current comment page:', currentCommentPage);
        fetchComments();
    }, [currentCommentPage, itemsPerCommentPage, commentsTotalCount]);

    const fetchComments = () => {
        //setLoading(true);
        TaskCommentService.getTaskCommentsByTaskId(Number(id), currentCommentPage, itemsPerCommentPage)
            .then((response) => {
                setTaskComments(response.comments);
                setCommentsTotalCount(response.totalCount);
            })
            .catch((error) => {
                setAlertMessage('Error: ' + error.message);
                setShowAlert(true); // Show alert on error
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
                console.log(response);
            })
            .catch((error) => {
                setAlertMessage('Error: ' + error.message);
                setShowAlert(true); // Show alert on error
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
                    console.log(response);
                    setShowAlert(false); // Hide alert on success
                })
                .catch((error) => {
                    setAlertMessage('Error: ' + error.message);
                    setShowAlert(true); // Show alert on error
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
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerCommentPage(Number(e.target.value));
        setCurrentCommentPage(1);
    };
    const renderCommentPaginationItems = () => {
            const items = [];
            const maxVisiblePages = 5;
    
            let startPage = Math.max(1, currentCommentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
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
    
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
                }
                items.push(
                    <Pagination.Item key={totalPages} onClick={() => handleCommentPageChange(totalPages)}>
                        {totalPages}
                    </Pagination.Item>
                );
            }
    
            return items;
        };

return (
    <>
        {!showAlert && !loading && fullTask && (
            
            <><div className='taskDetails'>
                <div className='taskDetailsHeader'>
                    <h1>{fullTask.title}</h1>
                    <div>
                        <Dropdown className='dropdown'>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className={`custom-dropdown-toggle ${statusLabels[fullTask.status as StatusEnum]?.color}`}>
                                {statusLabels[fullTask.status as StatusEnum]?.label || 'Select Status'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {Object.entries(statusLabels).map(([key, { label, color }]) => (
                                    <Dropdown.Item
                                        key={key}
                                        onClick={() => handleStatusChange(Number(key) as StatusEnum)}
                                        className={color + ' custom-dropdown-item'}
                                    >
                                        {label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
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
                        <div className='data-row '>
                            <div className="label">Spend Time:</div>
                            <div className="value">{hours} h {minutes} m</div>
                        </div>
                    </div>
                </div>
                <Tabs
                    defaultActiveKey="comments"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    >
                    <Tab eventKey="comments" title={`Comments (${commentsTotalCount})`}>
                        {!loading && !showAlert && (
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <Form.Group controlId="itemsPerPage" className="d-flex align-items-center mx-3">
                                    <Form.Label className="me-2 mb-0">Comments per page:</Form.Label>
                                    <Form.Select 
                                        value={itemsPerCommentPage}
                                        onChange={handleItemsPerPageChange}
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
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        )}
                        {taskComments.map((comment,index) => (
                            <TaskComment key={comment.id} taskComment={comment} />
                        ))}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <Pagination className="mb-0">
                                    <Pagination.Prev
                                        onClick={() => handleCommentPageChange(currentCommentPage - 1)}
                                        disabled={currentCommentPage === 1}
                                    />
                                    {renderCommentPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handleCommentPageChange(currentCommentPage + 1)}
                                        disabled={currentCommentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </Tab>
                    <Tab eventKey="timeLogs" title={`Time logs (${timeLogTotalCount})`} disabled={!isTimeLogEnabled}>
                        Tab content for Home
                    </Tab>
                    
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
    </>
    
    
    );
};

export default TaskPage;