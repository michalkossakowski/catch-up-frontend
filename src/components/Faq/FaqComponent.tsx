import React, { useState, useEffect } from 'react';
import './FaqComponent.css'; 
import { Accordion, Alert, Button, Form, InputGroup} from 'react-bootstrap';
import { FaqDto } from '../../dtos/FaqDto';
import { getFaqs, getByQuestion, deleteFaq } from '../../services/faqService';
import FaqEdit from './FaqEdit';
import Loading from '../Loading/Loading';
import FaqItem from './FaqItem';
import NotificationToast from '../Toast/NotificationToast';
import ConfirmModal from '../Modal/ConfirmModal';

export default function FaqComponent ({ isAdmin }: { isAdmin: boolean }): React.ReactElement{
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
        if (showEdit) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }, [showEdit]);
    

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
        if (searchQuestion.length == 0) {
            getAllFaqs()
            setShowSearchMessage(false);
            return
        }
        setLoading(true);
        getByQuestion(searchQuestion)
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


    const startDelete = (faqId: number) => {
        setFaqIdToDelete(faqId);
        setConfirmMessage("Are you sure you want to delete this FAQ?")
        setShowConfirmModal(true);
    };

    const handleDelete = () => {
        if(faqIdToDelete){
            deleteFaq(faqIdToDelete) 
                .then(() => {
                    setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== faqIdToDelete));
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

    const startEdit = (faqId: number) => {
        setEditedFaq(faqs.find((faq)=> faq.id === faqId));
        setShowEdit(true);
    };

    const handleFaqUpdated = () => {
        setToastMessage(`FAQ successfully ${editedFaq ? 'edited' : 'added'} !`);
        setShowToast(true);
        
        getAllFaqs();
        setShowEdit(false);
        setEditedFaq(null);
    };

    return (
        <>
            <section className='container'>
                <h2 className='title'>Frequently Asked Questions</h2>
                
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

                {loading && (
                    <div className='loaderBox'>
                        <Loading/>
                    </div>
                )}

                <div className='alertBox'>
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
                    <Accordion className='AccordionItem'>
                        {faqs.map((faq) => (
                            <FaqItem key={faq.id} faq={faq} index={i++} editClick={startEdit} isAdmin={isAdmin} deleteClick={startDelete}></FaqItem>
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

            {isAdmin && (
                <div>
                    <Button variant="primary" onClick={() => {setShowEdit(true); setEditedFaq(null)}}>
                        Add new FAQ
                    </Button>
                    {showEdit && !editedFaq && (
                        <FaqEdit isEditMode={false} onFaqEdited={handleFaqUpdated} onCancel={() => setShowEdit(false)}/>
                    )}
                    {showEdit && editedFaq && (
                        <FaqEdit faq={editedFaq} isEditMode={true} onFaqEdited={handleFaqUpdated} onCancel={() => setShowEdit(false)}/>
                    )}
                </div>
            )}
        </>
    );
};