import React, { useState, useEffect } from 'react'
import schoolingService from '../../services/schoolingService'
import {getCategories} from '../../services/categoryService'
import ErrorMessage from '../ErrorMessage'
import { FullSchoolingDto } from '../../dtos/FullSchoolingDto'
import { useAuth } from '../../Provider/authProvider'
import { Accordion, Alert, Button, Col, Form, Row } from 'react-bootstrap'
import Loading from '../Loading/Loading'
import { CategoryDto } from '../../dtos/CategoryDto'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSchooling } from '../../store/schoolingSlice';
import ConfirmModal from '../Modal/ConfirmModal'
import NotificationToast from '../Toast/NotificationToast'

const SchoolingListMentor: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    
    // Obsługa error-ów
    const [errorShow, setErrorShow] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [schoolingIdToDelete, setSchoolingIdToDelete] = useState<number | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [loading, setLoading] = useState(true)

    const [schoolingList, setSchoolingList] = React.useState<FullSchoolingDto[]>([])

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<React.ChangeEvent<HTMLSelectElement>>();
    const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);
    const [minPriority, setMinPriority] = useState<number>(0); // New state for minimum priority

    const [filteredSchoolings, setFilteredSchoolings] =  React.useState<FullSchoolingDto[]>([])

    const { user } = useAuth();

    useEffect(() => {
        initSchoolingList()
    }, [user?.id])
    
    useEffect(() => {
        filterSchoolings()
    }, [schoolingList, searchQuery, selectedCategoryId, minPriority])

    const initSchoolingList  = async () => {
        if(user?.id)
            getSchoolingList(user?.id).then((data) => {
                setSchoolingList(data)
            })     
            .catch((error) => {
                setErrorShow(true)
                setErrorMessage('Error: ' + error.message)
            })
            .finally(() => setLoading(false))

            getCategoryList().then((data) => {
                setAvailableCategories(data)
            })     
            .catch((error) => {
                setErrorShow(true)
                setErrorMessage('Error: ' + error.message)
            })
            .finally(() => setLoading(false));
        
    }

    const getSchoolingList = async (userId: string) => {
        try {
            const schoolingsData = await schoolingService.getAllFullSchoolingOfUser(userId)
            return schoolingsData
        } catch (error) {
            throw (error)
        }
    }

    const getCategoryList = async () => {
        try {
            const categoryData = await getCategories()
            return categoryData
        } catch (error) {
            throw (error)
        }
    }

    const filterSchoolings = () => {
        let filtered = schoolingList
    
        if (searchQuery) {
          filtered = filtered.filter(str =>
            str.schooling?.title?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
    
        if (selectedCategoryId && Number(selectedCategoryId.target.value)) {
            filtered = filtered.filter(s => s.category?.id === Number(selectedCategoryId.target.value));
        }

        if (minPriority > 0) {
            filtered = filtered.filter((s) => s.schooling?.priority && s.schooling.priority >= minPriority);
        }
        setFilteredSchoolings(filtered)
    }

    const goToDetails = (schooling: FullSchoolingDto) => {
        dispatch(setSchooling(schooling));
        navigate('/schoolingdetails');
    }
    const goToEditSchoolingPage = (schooling: FullSchoolingDto) => {
        dispatch(setSchooling(schooling));
        navigate('/schoolingedit');
    }
    
    const handleDelete = () => {
        if(schoolingIdToDelete){
            schoolingService.deleteSchooling(schoolingIdToDelete)
                .then(() => {
                    const updatedSchoolings = schoolingList.filter((el) => el.schooling?.id !== schoolingIdToDelete);
                    setSchoolingList(updatedSchoolings);
                    setErrorShow(false)
                    setShowToast(true);
                })
                .catch((error) => {
                    setErrorShow(true)
                    setErrorMessage('Error deleting Schooling: ' + error.message)
                })
            setToastMessage(`Schooling successfully deleted !`);
            setShowConfirmModal(false);
        }
    };
    const handleDeleteButton = (schooling: FullSchoolingDto) => {
        setConfirmMessage("You are going to delete Schooling. Are You sure ?")
        if(schooling.schooling?.id)
            setSchoolingIdToDelete(schooling.schooling?.id)
        setShowConfirmModal(true);
    }

    return (
        <section className="container mt-3 p-0">
            <ErrorMessage
                message={errorMessage || 'Undefine error'}
                show={errorShow}
                onHide={() => {
                setErrorShow(false);
                setErrorMessage(null);
            }} />
            <div className="container mb-3">
                
                <h2 className="text-center">List of Schoolings</h2>
                <div className="text-center">
                    <Form.Control
                        placeholder="Search by title"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <h4 className="mt-3">Advanced Filters</h4>
                    <Row className="mb-3">
                        <Form.Group as={Col}  className='col-6' >
                            <Form.Label>Category</Form.Label>
                            <Form.Select onChange={(el) => setSelectedCategoryId(el)} defaultValue="">
                                <option value="">Select Category</option>
                                {availableCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} className='col-6'>
                            <Form.Label>Minimal Priority</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter minimum priority"
                                value={minPriority}
                                onChange={(e) => setMinPriority(Number(e.target.value))}
                            />
                        </Form.Group>
                    </Row>
                </div>
                {loading && (
                    <div className='mt-3'>
                        <Loading/>
                    </div>
                )}
                {!loading && (
                <Accordion className="text-start mt-3 mb-3">
                    {filteredSchoolings.length === 0 ? (
                    <Alert variant="warning">No schoolings found</Alert>
                    ) : (
                    filteredSchoolings.map((item, index) => (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                            <Accordion.Header>
                                <strong>{index + 1}. {item.schooling?.title}</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                <p className="fs-3 fw-bold">Category: {item.category?.name}</p>
                                <p className="fs-5 fw-bold">Priority: {item.schooling?.priority}</p>
                                <p>{item.schooling?.description}</p>
                                <div className="d-flex justify-content-between btn-group" role="group">
                                    <Button
                                        variant="primary"
                                        onClick={() => goToDetails(item)}
                                    >
                                        See More
                                    </Button>
                                    <Button
                                        className='text-white'
                                        variant="warning"
                                        onClick={() => goToEditSchoolingPage(item)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteButton(item)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        ))
                    )}
                </Accordion>
                )}
            </div>
            <NotificationToast 
                    show={showToast} 
                    title={"Schooling operation info"} 
                    message={toastMessage} 
                    color={"green"} 
                    onClose={() => setShowToast(false)} />
            <ConfirmModal 
                show={showConfirmModal} 
                title="Schooling operation confirmation"
                message={confirmMessage}
                onConfirm={handleDelete} 
                onCancel={() => setShowConfirmModal(false)} 
            />
        </section>
    )
}

export default SchoolingListMentor;
