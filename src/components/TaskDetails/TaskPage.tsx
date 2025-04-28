import { useParams } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { TaskCommentDto } from '../../dtos/TaskCommentDto';
import { TaskTimeLogDto } from '../../dtos/TaskTimeLogDto';
import { GetFullTaskData,setTaskStatus } from '../../services/taskService';
import { Alert, Dropdown } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import { StatusEnum } from '../../Enums/StatusEnum';
import './TaskPage.css';
import MaterialItem from '../MaterialManager/MaterialItem';

const TaskPage = () => {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [fullTask, setTask] = useState<FullTaskDto | null>(null)
    const [taskComments, setTaskComments] = useState<TaskCommentDto[]>([]);
    const [taskTimeLogs, setTaskTimeLogs] = useState<TaskTimeLogDto[]>([]);
    const [commentsTotalCount, setCommentsTotalCount] = useState(0);
    const [timeLogTotalCount, setTimeLogTotalCount] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

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


return (
    <>
        {!showAlert && !loading && fullTask && (
            
            <div className='taskDetails'>
                <div className='taskDetailsHeader'>
                    <h1>{fullTask.title}</h1>
                    <div>
                        <Dropdown className='dropdown'>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className={`custom-dropdown-toggle ${statusLabels[fullTask.status as StatusEnum]?.color}`}>
                                {statusLabels[fullTask.status as StatusEnum]?.label || 'Select Status'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {Object.entries(statusLabels).map(([key, {label, color }]) => (
                                    <Dropdown.Item
                                        key={key}
                                        onClick={() => handleStatusChange(Number(key) as StatusEnum)}
                                        className={ color }
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
                                enableEdittingMaterialName ={false}
                                enableEdittingFile={false}
                                showMaterialName= {true}
                                nameTitle='See Materials'
                            />
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
                

            </div>
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