import React, { useState, useEffect } from 'react';
import './FaqComponent.css'; 
import { Accordion, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { FaqDto } from '../../dtos/FaqDto';
import { getFaqs, getByTitle, deleteFaq } from '../../services/faqService';
import Material from '../Material/Material';
import FaqEdit from './FaqEdit';
import Loading from '../Loading/Loading';

const FaqComponent: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
    const [faqs, setFaqs] = useState<FaqDto[]>([]);
    const [loading, setLoading] = useState(true)
    const [showError, setShowError] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [showSearchMessage, setShowSearchMessage] = useState(false)
    const [searchMessage, setSearchMessage] = useState('alert')
    const [searchTitle, setSearchTitle] = useState('');
    let i = 1;
    const [showEdit, setShowEdit] = useState(false);
    const [editedFaq, setEditedFaq] = useState<FaqDto | null>();

    useEffect(() => {
        getAllFaqs();
    }, []);


    const getAllFaqs = () => {
        setLoading(true);
        getFaqs()
        .then((data) => {
            setFaqs(data);
            setShowError(false); 
        })
        .catch((error) => {
            setShowError(true);
            setAlertMessage('Error: ' + error.message);
        })
        .finally(() => setLoading(false));
    }

    const searchFaq = () => {
        if (searchTitle.length == 0) {
            getAllFaqs()
            setShowSearchMessage(false);
            return
        }
        setLoading(true);
        getByTitle(searchTitle)
            .then((data) => {
                setFaqs(data);
                setShowSearchMessage(false);
            })
            .catch((error) => {
                setShowSearchMessage(true);
                setSearchMessage(error.message);
            })
            .finally(() => setLoading(false));
    };


    const handleDelete = (faqId: number) => {
        deleteFaq(faqId) 
            .then(() => {
                setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== faqId));
            })
            .catch((error) => {
                setShowError(true)
                setAlertMessage('Error deleting FAQ: ' + error.message)
            })
    };

    const editClick = (faqId: number) => {
        setEditedFaq(faqs.find((faq)=> faq.id === faqId));
        setShowEdit(true);
    };

    const handleFaqUpdated = () => {
        getAllFaqs();
        setShowEdit(false);
        setEditedFaq(null);
    };

    const materialCreated = (materialId: number) => {
        return materialId
    }      
      
    return (
        <>
            {isAdmin && (
                <div>
                    {!showEdit && (
                        <FaqEdit isEditMode={false} onFaqEdited={handleFaqUpdated}/>
                    )}
                    {showEdit && editedFaq && (
                        <div>
                            <Button variant="primary" onClick={() => setShowEdit(false)}>
                                Back to Add
                            </Button>
                            <FaqEdit faq={editedFaq} isEditMode={true} onFaqEdited={handleFaqUpdated} />
                        </div>
                    )}
                </div>
            )}


            <section className='container'>
                <h2 className='title'>Frequently Asked Questions</h2>
                
                <div className='searchBox'>
                    <InputGroup className="inputGroup mb-3">
                        <Form.Control
                            placeholder="Enter searching title..."
                            value={searchTitle} 
                            onChange={(e) => setSearchTitle(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && searchFaq()}
                        />
                        <Button variant="primary" id="searchButton" onClick={searchFaq}> 
                            Search
                        </Button>
                    </InputGroup>
                </div>

                <div className='loaderBox'>
                    
                    {loading && (
                        <Loading/>
                    )}

                    {showError &&(
                        <Alert className='alert' variant='danger'>
                            {alertMessage}
                        </Alert>
                    )}

                    {showSearchMessage &&(
                        <Alert className='alert' variant='warning'>
                            {searchMessage}
                        </Alert>
                    )}
                </div>

                {!showSearchMessage && !showError && !loading &&(
                    <div>
                        <Accordion className='AccordionItem'>
                            {faqs.map((faq) => (
                                <Accordion.Item eventKey={faq.id.toString()} key={faq.id}>
                                    <Accordion.Header>
                                        {i++}. {faq.title}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p>{faq.answer}</p>

                                        {faq.materialsId && (
                                            <div> 
                                                Additional materials:                                
                                                <Material materialId={faq.materialsId} showDownloadFile={true} materialCreated={materialCreated} />
                                            </div>  
                                        )}

                                        {isAdmin && (
                                            <div className='buttonBox'>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => editClick(faq.id)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(faq.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                )}
            </section>
        </>
    );
};

export default FaqComponent;
