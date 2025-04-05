import React, { useEffect, useState } from "react";
import { Alert, Card, Pagination, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { markAsRead, setNotifications, setNotificationsCount } from '../../store/notificationSlice';
import { getNotifications, readNotifications } from '../../services/notificationService';

const NotificationPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loadMoreVisibility, setLoadMoreVisibility] = useState(false);

    const { notifications } = useSelector((state: RootState) => state.notifications);

    const indexOfLastNotification = currentPage * itemsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - itemsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    const { notificationsCount } = useSelector((state: RootState) => state.notifications);

    const handleCardClick = (source: string) => {
        navigate(source);
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

    const handleLoadMore = () => {
        if(notifications.length >= notificationsCount){
            setLoadMoreVisibility(false);
        }else{
            let page = Math.ceil(notifications.length / 50) + 1;
            getNotifications(page, 50).then((res) => {
                const merged = [...notifications, ...res.notifications];
                const unique = Array.from(
                    new Map(merged.map(n => [n.notificationId, n])).values()
                );
                dispatch(setNotifications(unique));
                dispatch(setNotificationsCount(res.totalCount));
            })
        }
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

    useEffect(() => {
        if(notificationsCount > 50) {
            setLoadMoreVisibility(true);
        }
        return () => {
            readNotifications();
            dispatch(markAsRead());
            
        };
    }, [dispatch]);

    return (
        <div>
            <h1 className="m-3"><i className="bi bi-bell"/> Notifications</h1>
            <div className="notification-container">
                {notifications.length === 0 ? (
                    <div className='alertBox m-3'>
                        <Alert className='no-notificaitons-alert' variant='info'>
                            <i className="bi bi-bell"></i>
                            &nbsp;
                            You don’t have any notifications
                            &nbsp;
                            <i className="bi bi-bell"></i>
                        </Alert>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between mb-3 align-items-center">
                            <Form.Group controlId="itemsPerPage" className="d-flex align-items-center mx-3">
                                <Form.Label className="me-2 mb-0">Notifications per page:</Form.Label>
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
                        {currentNotifications.map((notification, index) => (
                            <div className="notification-card-container" key={index}>
                                {!notification.isRead && (
                                    <small className="text-primary notification-new">
                                        New
                                    </small>
                                )}
                                <Card
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleCardClick(notification.source)}
                                    className={`notification-card ${!notification.isRead ? 'notification-card-unread' : ''}`}
                                >
                                    <Card.Body>
                                        <Card.Title as="h5">{notification.title}</Card.Title>
                                        <Card.Text>{notification.message}</Card.Text>
                                        <div className="notification-footer">
                                            <small className="text-primary">
                                                See more: {notification.source}
                                            </small>
                                            <small className="text-muted">
                                                {new Date(notification.sendDate).toLocaleString()}
                                            </small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                        
                        { currentPage == totalPages && (loadMoreVisibility ? (
                            <button  className="btn btn-primary m-3" onClick={() => handleLoadMore()}>
                                    Load more ... 
                            </button>
                        ) : (
                            <div className="alertBox">
                                <Alert className='info m-3' variant='secondary'>
                                    <i className="bi-bell"></i> 
                                    &nbsp;
                                    You don't have any more old notifications
                                    &nbsp;
                                    <i className="bi-bell"></i>
                                </Alert>
                            </div>
                        ))}
                        {totalPages > 1 && (
                            <Pagination className="justify-content-center mt-3">
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;