import React, { useState, useEffect } from 'react';
import './FaqComponent.css'; 
import { Accordion, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { FaqDto } from '../../dtos/faqDto';
import { getFaqs, getByTitle } from '../../services/faqService';
import Material from '../Material/Material';

const FaqComponent: React.FC = () => {
    const [faqs, setFaqs] = useState<FaqDto[]>([]);
    const [loading, setLoading] = useState(true)
    const [showError, setShowError] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [showSearchMessage, setShowSearchMessage] = useState(false)
    const [searchMessage, setSearchMessage] = useState('alert')
    const [searchTitle, setSearchTitle] = useState('');
    let i = 1;

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

    const materialCreated = (materialId: number) => {
        return materialId
      }      
      
    return (
        <>
            <section className='container'>
                <h2 className='title'>Frequently Asked Questions</h2>
                
                {!showError && faqs.length > 0 &&(
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
                )}
                    

                <div className='loaderBox'>
                    {loading && (
                        <span className='loader'></span>
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
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
                
            </section>
            
        </>
    );
};

export default FaqComponent;
