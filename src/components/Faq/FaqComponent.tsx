import React, { useState, useEffect } from 'react';
import './FaqComponent.css'; 
import { Accordion, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { FaqDto } from '../../dtos/FaqDto';
import { getFaqs, getByTitle, deleteFaq } from '../../services/faqService';
import FaqEdit from './FaqEdit';
import Loading from '../Loading/Loading';
import FaqItem from './FaqItem';

const FaqComponent: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
    const [faqs, setFaqs] = useState<FaqDto[]>([]);
    const [loading, setLoading] = useState(true)
    const [showAlert, setShowAlert] = useState(false)
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
            setShowAlert(false); 
        })
        .catch((error) => {
            setShowAlert(true);
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
                setShowAlert(true)
                setAlertMessage('Error deleting FAQ: ' + error.message)
            })
    };

    const handleEdit= (faqId: number) => {
        setEditedFaq(faqs.find((faq)=> faq.id === faqId));
        setShowEdit(true);
    };

    const handleFaqUpdated = () => {
        getAllFaqs();
        setShowEdit(false);
        setEditedFaq(null);
    };

    return (
        <>
            {isAdmin && (
                <div>
                    <Button variant="primary" onClick={() => {setShowEdit(true); setEditedFaq(null)}}>
                        Add new FAQ
                    </Button>
                    {showEdit && !editedFaq && (
                        <FaqEdit isEditMode={false} onFaqEdited={handleFaqUpdated} onCancel={() => setShowEdit(false)}/>
                    )}
                    {showEdit && editedFaq && (
                        <div>
                            <FaqEdit faq={editedFaq} isEditMode={true} onFaqEdited={handleFaqUpdated} onCancel={() => setShowEdit(false)}/>
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

                    {showAlert &&(
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

                {!showSearchMessage && !showAlert && !loading &&(
                    <div>
                        <Accordion className='AccordionItem'>
                            {faqs.map((faq) => (
                              <FaqItem key={faq.id} faq={faq} index={i++} editClick={handleEdit} isAdmin={isAdmin} deleteClick={handleDelete}></FaqItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </section>
        </>
    );
};

export default FaqComponent;
