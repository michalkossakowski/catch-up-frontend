import React, { useState, useEffect } from 'react'
import schoolingService from '../../services/schoolingService'
import {getCategories} from '../../services/categoryService'
import ErrorMessage from '../ErrorMessage'
import { FullSchoolingDto } from '../../dtos/FullSchoolingDto'
import { useAuth } from '../../Provider/authProvider'
import { Accordion, Alert, Button, Form } from 'react-bootstrap'
import Loading from '../Loading/Loading'
import { CategoryDto } from '../../dtos/CategoryDto'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSchooling } from '../../store/schoolingSlice';
const SchoolingListNewbie: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Obsługa error-ów
    const [errorShow, setErrorShow] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
        
    const [loading, setLoading] = useState(true)

    const [schoolingList, setSchoolingList] = React.useState<FullSchoolingDto[]>([])

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<React.ChangeEvent<HTMLSelectElement>>();
    const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);

    const [filteredSchoolings, setFilteredSchoolings] =  React.useState<FullSchoolingDto[]>([])

    const { user } = useAuth();

    useEffect(() => {
        initSchoolingList()
    }, [user?.id])
    
    useEffect(() => {
        filterSchoolings()
    }, [schoolingList, searchQuery, selectedCategoryId])

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
    
        setFilteredSchoolings(filtered)
    }

    const goToDetails = (schooling: FullSchoolingDto) => {
        dispatch(setSchooling(schooling));
        navigate('/schoolingdetails');
    };

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
                    <h4 className="mt-3">Filter by Category</h4>
                    <Form.Select onChange={(el) => setSelectedCategoryId(el)} defaultValue="">
                        <option value="">Select Category</option>
                        {availableCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                            {cat.name}
                            </option>
                        ))}
                    </Form.Select>
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

                                <div className="d-flex justify-content-between">
                                <Button
                                    variant="primary"
                                    onClick={() => goToDetails(item)}
                                >
                                    See More
                                </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        ))
                    )}
                </Accordion>
                )}
            </div>
        </section>
    )
}

export default SchoolingListNewbie;
