import React, { useState, useEffect } from 'react';
import './FaqComponent.css'; 
import { Accordion, Alert, Button, Form, InputGroup} from 'react-bootstrap';
import { FaqDto, FaqResponse } from '../../dtos/FaqDto';
import { getFaqs, deleteFaq } from '../../services/faqService';
import FaqEdit from './FaqEdit';
import Loading from '../Loading/Loading';
import FaqItem from './FaqItem';
import NotificationToast from '../Toast/NotificationToast';
import ConfirmModal from '../Modal/ConfirmModal';

export default function FaqComponent ({ isAdmin }: { isAdmin: boolean }): React.ReactElement{
    const [allFaqs, setAllFaqs] = useState<FaqDto[]>([]);
    const [faqs, setFaqs] = useState<FaqDto[]>([]);
    const [loading, setLoading] = useState(true)
  
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    
    const [showSearchMessage, setShowSearchMessage] = useState(false)
    const [searchMessage, setSearchMessage] = useState('alert')
    const [searchQuestion, setSearchQuestion] = useState('');

    const [showEdit, setShowEdit] = useState(false);
    const [editedFaq, setEditedFaq] = useState<FaqDto | null>();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [faqIdToDelete, setFaqIdToDelete] = useState<number | null>(null);
    
    let i = 1;

    useEffect(() => {
        getAllFaqs();
    }, []);

    useEffect(() => {
        if (showEdit || editedFaq) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }, [showEdit, editedFaq]);
    

    const getAllFaqs = () => {
        setLoading(true);
        getFaqs()
            .then((data) => {
                setAllFaqs(data);
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
        if (searchQuestion.length == 0) {
            setFaqs(allFaqs);
            setShowSearchMessage(false);
            return
        }
        setLoading(true);

        const filteredFaqs = allFaqs.filter(faq => 
            faq.question.toLowerCase().includes(searchQuestion.toLowerCase()) 
            || faq.answer.toLowerCase().includes(searchQuestion.toLowerCase()) 
        );

        if (filteredFaqs.length === 0) {
            setShowSearchMessage(true);
            setSearchMessage(`No Questions with: '${searchQuestion}' inside found.`);
        } 
        else {
            setShowSearchMessage(false);
        }

        setLoading(false);
        setFaqs(filteredFaqs);
    };


    const initDelete = (faqId: number) => {
        setFaqIdToDelete(faqId);
        setConfirmMessage("Are you sure you want to delete this FAQ?")
        setShowConfirmModal(true);
    };

    const handleDelete = () => {
        if(faqIdToDelete){
            deleteFaq(faqIdToDelete) 
                .then(() => {
                    const updatedFaqs = allFaqs.filter((faq) => faq.id !== faqIdToDelete);
                    setAllFaqs(updatedFaqs);
                    setFaqs(updatedFaqs);
                })
                .catch((error) => {
                    setShowAlert(true)
                    setAlertMessage('Error deleting FAQ: ' + error.message)
                })
            setToastMessage(`FAQ successfully deleted !`);
            setShowToast(true);
            setFaqIdToDelete(null);
            setShowConfirmModal(false);
        }
    };

    const initEdit = (faqId: number) => {
        setEditedFaq(faqs.find((faq)=> faq.id === faqId));
        setShowEdit(true);
    };

    const handleFaqUpdated = (response: FaqResponse) => {
        setToastMessage(`FAQ successfully ${editedFaq ? 'edited' : 'added'} !`);
        setShowToast(true);
        
        const updatedFaqs = editedFaq 
        ? allFaqs.map((faq) => (faq.id == response.faq.id ? response.faq : faq))
        : [...allFaqs, response.faq]

        setAllFaqs(updatedFaqs);
        setFaqs(updatedFaqs);
        setShowEdit(false);
        setEditedFaq(null);
    };

    return (
        <>
            <h2 className='title'>Frequently Asked Questions</h2>
            <section className='container'>
                {!showAlert && !loading && (
                    <div className='searchBox'>
                        <InputGroup className="inputGroup mb-3">
                            <Form.Control
                                placeholder="Enter searching question..."
                                value={searchQuestion} 
                                onChange={(e) => setSearchQuestion(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && searchFaq()}
                            />
                            <Button variant="primary" id="searchButton" onClick={searchFaq}> 
                                Search
                            </Button>
                        </InputGroup>
                    </div>
                )}

                {loading && (
                    <div className='loaderBox'>
                        <Loading/>
                    </div>
                )}


                    {showAlert &&(
                        <div className='alertBox'>
                            <Alert className='alert' variant='danger'>
                                {alertMessage}
                            </Alert>
                        </div>
                    )}

                    {showSearchMessage &&(
                        <Alert className='alert' variant='warning'>
                            {searchMessage}
                        </Alert>
                    )}


                {!showSearchMessage && !showAlert && !loading &&(
                    <Accordion className='AccordionItem'>
                        {faqs.map((faq) => (
                            <FaqItem key={faq.id} faq={faq} index={i++} editClick={initEdit} isAdmin={isAdmin} deleteClick={initDelete}></FaqItem>
                        ))}
                    </Accordion>
                )}
            </section>
            
            <NotificationToast 
                show={showToast} 
                title={"FAQ operation info"} 
                message={toastMessage} 
                color={"green"} 
                onClose={() => setShowToast(false)} />
            
            <ConfirmModal 
                show={showConfirmModal} 
                title="FAQ operation confirmation"
                message={confirmMessage}
                onConfirm={handleDelete} 
                onCancel={() => setShowConfirmModal(false)} 
            />

            {isAdmin && !showAlert && (
                <div>
                    <Button variant="primary" onClick={() => {setShowEdit(true); setEditedFaq(null)}}>
                        Add new FAQ
                    </Button>
                    {showEdit && !editedFaq && (
                        <FaqEdit isEditMode={false} onFaqEdited={(response) => handleFaqUpdated(response)} onCancel={() => setShowEdit(false)}/>
                    )}
                    {showEdit && editedFaq && (
                        <FaqEdit faq={editedFaq} isEditMode={true} onFaqEdited={(response) => handleFaqUpdated(response)} onCancel={() => setShowEdit(false)}/>
                    )}
                </div>
            )}
        </>
    );
};