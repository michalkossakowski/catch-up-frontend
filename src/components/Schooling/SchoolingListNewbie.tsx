import React, { useState, useEffect } from 'react'
import schoolingService from '../../services/schoolingService'
import ErrorMessage from '../ErrorMessage'
import { FullSchoolingDto } from '../../dtos/FullSchoolingDto'
import { useAuth } from '../../Provider/authProvider'
import { Accordion, Alert, Button } from 'react-bootstrap'
import Loading from '../Loading/Loading'

const SchoolingListNewbie: React.FC = () => {
    
    // Obsługa error-ów
    const [errorShow, setErrorShow] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
        
    const [loading, setLoading] = useState(true)

    const [schoolingList, setSchoolingList] = React.useState<FullSchoolingDto[]>([])
    const [filteredSchoolings, setFilteredSchoolings] =  React.useState<FullSchoolingDto[]>([])
    const { user } = useAuth();

    useEffect(() => {
        initSchoolingList()
    }, [user?.id])

    const initSchoolingList  = async () => {
        if(user?.id)
            getSchoolingList(user?.id).then((data) => {
                setSchoolingList(data)
                filterSchoolings(data)
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

    const filterSchoolings = (schoolingList: FullSchoolingDto[]) => {
        let filtered = schoolingList
    
        // if (searchQuery) {
        //   filtered = filtered.filter(s =>
        //     s.Schooling.Title.toLowerCase().includes(searchQuery.toLowerCase())
        //   );
        // }
    
        // if (selectedCategoryId) {
        //   filtered = filtered.filter(s => s.Category.Id === Number(selectedCategoryId));
        // }
    
        setFilteredSchoolings(filtered)
    }
    function setSelectedSchooling(item: FullSchoolingDto): void {
        throw new Error('Function not implemented.')
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
                                    onClick={() => setSelectedSchooling(item)}
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
