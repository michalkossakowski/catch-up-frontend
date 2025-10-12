import React, { useState, useEffect } from 'react';
import './FaqComponent.css'; 
import { Accordion, Alert, Button, Form, InputGroup, Pagination, Modal } from 'react-bootstrap'; // Dodano Modal
import { FaqDto, FaqResponse } from '../../dtos/FaqDto';
import { getFaqs, deleteFaq, getBySearch } from '../../services/faqService';
import FaqEdit from './FaqEdit';
import Loading from '../Loading/Loading';
import FaqItem from './FaqItem';
import NotificationToast from '../Toast/NotificationToast';
import ConfirmModal from '../Modal/ConfirmModal';
import { useLocation } from 'react-router-dom';

export default function FaqComponent ({ isAdmin }: { isAdmin: boolean }): React.ReactElement {
    const [allFaqs, setAllFaqs] = useState<FaqDto[]>([]);
    const [faqs, setFaqs] = useState<FaqDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    
    const [showSearchMessage, setShowSearchMessage] = useState(false);
    const [searchMessage, setSearchMessage] = useState('alert');
    const [searchPhrase, setsearchPhrase] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editedFaq, setEditedFaq] = useState<FaqDto | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [faqIdToDelete, setFaqIdToDelete] = useState<number | null>(null);
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const location = useLocation();
    const [locationSearch, setLocationSearch] = useState(false);

    useEffect(() => {
        const phrase = location.state?.searchPhrase;
        if (phrase) {
            setsearchPhrase(phrase);
            setLocationSearch(true);
        } else {
            getAllFaqs();
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        if (locationSearch && searchPhrase.length > 0) {
            setLocationSearch(false);
            searchFaq();
        }
    }, [searchPhrase]);

    const getAllFaqs = () => {
        setLoading(true);
        getFaqs(currentPage, itemsPerPage)
            .then((data) => {
                setAllFaqs(data.faqs);
                setFaqs(data.faqs);
                setTotalItems(data.totalCount);
                setShowAlert(false); 
                setIsSearching(false);
                setsearchPhrase(''); 
                setShowSearchMessage(false); 
            })
            .catch((error) => {
                setShowAlert(true);
                setAlertMessage('Error: ' + error.message);
            })
            .finally(() => setLoading(false));
    };

    const searchFaq = () => {
        if (searchPhrase.length === 0) {
            setFaqs(allFaqs);
            setShowSearchMessage(false);
            setIsSearching(false);
            return;
        }
        setLoading(true);
        getBySearch(searchPhrase)
            .then((data) => {
                if (data.length === 0) {
                    setShowSearchMessage(true);
                    setSearchMessage(`No Questions with: '${searchPhrase}' inside found.`);
                } else {
                    setShowSearchMessage(false);
                    setFaqs(data);
                    setIsSearching(true);
                }
            })
            .catch((error) => {
                setShowAlert(true);
                setAlertMessage('Error: ' + error.message);
            })
            .finally(() => setLoading(false));
    };

    const resetSearch = () => {
        location.state.searchPhrase = null
        setsearchPhrase('')
        getAllFaqs();
    };

    const initDelete = (faqId: number) => {
        setFaqIdToDelete(faqId);
        setConfirmMessage("Are you sure you want to delete this FAQ?");
        setShowConfirmModal(true);
    };

    const handleDelete = () => {
        if(faqIdToDelete){
            deleteFaq(faqIdToDelete) 
                .then(() => {
                    getAllFaqs();
                })
                .catch((error) => {
                    setShowAlert(true);
                    setAlertMessage('Error deleting FAQ: ' + error.message);
                });
            setToastMessage(`FAQ successfully deleted!`);
            setShowToast(true);
            setFaqIdToDelete(null);
            setShowConfirmModal(false);
        }
    };

    const initEdit = (faqId: number) => {
        const foundFaq = faqs.find((faq) => faq.id === faqId);
        setEditedFaq(foundFaq || null);
        setShowEditModal(true);
    };

    const handleFaqUpdated = (response: FaqResponse) => {
        setToastMessage(`FAQ successfully ${editedFaq ? 'edited' : 'added'}!`);
        setShowToast(true);
        const updatedFaqs = editedFaq 
        ? allFaqs.map((faq) => (faq.id == response.faq.id ? response.faq : faq))
        : [...allFaqs, response.faq]

        if (response.faq.materialId) {
            document.dispatchEvent(
                new CustomEvent('refreshMaterial', {
                detail: { materialId: response.faq.materialId },
                })
            );
        }
        setAllFaqs(updatedFaqs);
        if (currentPage === Math.ceil(totalItems/ itemsPerPage)) {
            setFaqs(updatedFaqs);
        }
        setShowEditModal(false); 
        setEditedFaq(null);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handlePageSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPage = Number(e.target.value);
        handlePageChange(newPage);
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    const getFaqIndex = (index: number) => {
        return isSearching ? index + 1 : (currentPage - 1) * itemsPerPage + index + 1;
    };

    return (
        <>
            <h1 className='title'><i className='bi bi-question-circle'/> Frequently Asked Questions</h1>
            <section className='container'>
                {!showAlert && !loading && (
                    <div className='searchBox'>
                        <InputGroup className="inputGroup">
                            <Form.Control
                                placeholder="Enter searching question..."
                                value={searchPhrase} 
                                onChange={(e) => setsearchPhrase(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && searchFaq()}
                            />
                            <Button variant="primary" id="searchButton" onClick={searchFaq}> 
                                <i className="bi bi-search"> {' '}</i>Search 
                            </Button>
                        </InputGroup>
                    </div>
                )}
                {isSearching && (
                    <Button variant="secondary" id="cancel-search" onClick={resetSearch} className="mb-3">
                        <i className="bi bi-x-circle"> {' '}</i>Cancel search
                    </Button>
                )}
                {!isSearching && !loading && !showAlert && (
                    <div className="d-flex justify-content-between mb-3 align-items-center">
                        <Form.Group controlId="itemsPerPage" className="d-flex align-items-center mx-3">
                            <Form.Label className="me-2 mb-0">FAQs per page:</Form.Label>
                            <Form.Select 
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                style={{ width: 'auto' }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="pageSelect" className="d-flex align-items-center mx-3">
                            <Form.Label className="me-2 mb-0">Page:</Form.Label>
                            <Form.Select
                                value={currentPage}
                                onChange={handlePageSelectChange}
                                style={{ width: 'auto' }}
                            >
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
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

                {showSearchMessage && (
                    <Alert className='alert' variant='warning'>
                        {searchMessage}
                    </Alert>
                )}

                {!showSearchMessage && !showAlert && !loading && (
                    <>
                        <Accordion className='AccordionItem'>
                            {faqs.map((faq, index) => (
                                <FaqItem 
                                    key={faq.id} 
                                    faq={faq} 
                                    index={getFaqIndex(index)} 
                                    editClick={initEdit} 
                                    isAdmin={isAdmin} 
                                    deleteClick={initDelete}
                                />
                            ))}
                        </Accordion>
                        {!isSearching && totalPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <Pagination className="mb-0">
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    {renderPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </section>
            
            <NotificationToast 
                show={showToast} 
                title={"FAQ operation info"} 
                message={toastMessage} 
                color={"green"} 
                onClose={() => setShowToast(false)} 
            />
            
            <ConfirmModal 
                show={showConfirmModal} 
                title="FAQ operation confirmation"
                message={confirmMessage}
                onConfirm={handleDelete} 
                onCancel={() => setShowConfirmModal(false)} 
            />

            {isAdmin && !showAlert && !loading && (
                <div>
                    <Button variant="primary mb-3" onClick={() => {setShowEditModal(true); setEditedFaq(null)}}>
                        <i className='bi-plus-lg' style={{color: 'white'}}></i> Add new FAQ
                    </Button>
                </div>
            )}

            <Modal 
                show={showEditModal} 
                onHide={() => {setShowEditModal(false); setEditedFaq(null)}} 
                size="lg" 
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editedFaq ? 'Edit FAQ' : 'Add new FAQ'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FaqEdit 
                        isEditMode={!!editedFaq} 
                        faq={editedFaq || undefined} 
                        onFaqEdited={(response) => handleFaqUpdated(response)}
                        onCancel={() => {setShowEditModal(false); setEditedFaq(null)}}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}