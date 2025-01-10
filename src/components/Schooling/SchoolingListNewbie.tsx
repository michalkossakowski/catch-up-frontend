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
    const [minPriority, setMinPriority] = useState<number>(0)

    const [filteredSchoolings, setFilteredSchoolings] =  React.useState<FullSchoolingDto[]>([])

    const [sortOption, setSortOption] = useState<string>('title')
    const [sortDirection, setSortDirection] = useState<string>('asc')

    const { user } = useAuth();

    useEffect(() => {
        initSchoolingList()
    }, [user?.id])
    
    useEffect(() => {
        filterSchoolings()
    }, [schoolingList, searchQuery, selectedCategoryId, minPriority, sortOption, sortDirection])

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
        if (sortOption) {

            filtered = [...filtered].sort((a: FullSchoolingDto, b: FullSchoolingDto) => {
                const direction = sortDirection === 'asc' ? 1 : -1;
                switch (sortOption) {
                    case 'title':
                        return direction * (a.schooling?.title || '').localeCompare(b.schooling?.title || '');
                    case 'priority':
                        return direction * -1 * ((b.schooling?.priority || 0) - (a.schooling?.priority || 0));
                    case 'category':
                        return direction * (a.category?.name || '').localeCompare(b.category?.name || '');
                    default:
                        return 0;
                }
            })
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
                    <h4 className="mt-3">Advanced Filters</h4>
                    <Row className="mb-3">
                        <Form.Group as={Col}  className='col-4' >
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
                        <Form.Group as={Col} className='col-2'>
                            <Form.Label>Min Priority</Form.Label>
                            <Form.Control
                                className='text-center'
                                type="number"
                                placeholder="Enter minimum priority"
                                value={minPriority}
                                onChange={(e) => setMinPriority(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Form.Group as={Col} className='col-4'>
                            <Form.Label>Sort By</Form.Label>
                            <Form.Select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="title">Title</option>
                                <option value="priority">Priority</option>
                                <option value="category">Category</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} className='col-2'>
                            <Form.Label>Sort Direction</Form.Label>
                            <Form.Select
                                value={sortDirection}
                                onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </Form.Select>
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
