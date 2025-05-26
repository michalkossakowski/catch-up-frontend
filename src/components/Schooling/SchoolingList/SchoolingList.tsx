import { useEffect, useState } from "react";
import Loading from "../../Loading/Loading";
import { SchoolingQueryParameters } from "../../../dtos/SchoolingQueryParametersDto";
import { getSchoolings } from "../../../services/schoolingService";
import { PagedResponse } from "../../../interfaces/PagedResponse";
import { SchoolingDto } from "../../../dtos/SchoolingDto";
import Select from 'react-select'
import SchoolingListItem from "./SchoolingListItem";
import { getCategories } from "../../../services/categoryService";
import { CategoryDto } from "../../../dtos/CategoryDto";
import makeAnimated from 'react-select/animated';
import "./SchoolingList.scss";
import { Button, CloseButton, Dropdown, Form, InputGroup, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getRole } from "../../../services/userService";
import { useAuth } from "../../../Provider/authProvider";

const SchoolingList: React.FC = () => {
    const animatedComponents = makeAnimated();

    const [schoolings, setSchoolings] = useState<PagedResponse<SchoolingDto> | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<CategoryDto[]  | null>(null);
    
    //Filters and Pagination
    const [selectedCategory, setSelectedCategory] = useState<{ value: number; label: string } | null>(null);
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [subscribedSchooling, setSubscribedSchooling] = useState(true);
    const [myCreatedSchoolings, setMyCreatedSchoolings] = useState(true);

    //Sidebar
    const [show, setShow] = useState(false);
    const [selectedSchooling, setSelectedSchooling] = useState<SchoolingDto | null>(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { user, getRole } = useAuth();
    const navigate = useNavigate();

    // Role
    const [role, setRole] = useState<string | null>(null);

    var params: SchoolingQueryParameters = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        titleFilter: searchTitle,
        categoryFilter: selectedCategory?.value || undefined,
    }

    useEffect(() => {
        setLoading(true);
        fetchRole();
        fetchSchoolings(params);
        fetchCateregories()
    }, [])

    const fetchCateregories = async () => {
        getCategories().then((res) => {
            setCategories(res);
        }).catch((error) => {
            console.error('Failed to fetch categories', error);
            return [];
        });
    }
    
    const fetchRole = async () => {
        try {
            setRole(await getRole(user?.id as string));
        } catch (error) {
            console.log('Failed to fetch user role');
        }
    };
    
    const fetchSchoolings = async (params: SchoolingQueryParameters) => {
        setLoading(true);
        try {
            const data = await getSchoolings(params);
            setSchoolings(data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch schoolings');
        } finally {
            setLoading(false);
        }
    };

    const options = categories?.map((cat) => ({
        value: cat.id,
        label: cat.name || `Category ${cat.id}`,
    })) || [];
    
    
    if (loading) return <div><Loading/></div>;
    if (!schoolings) return <div>No data</div>;

    const handleSearchBar = () => {
        params.titleFilter = searchTitle || undefined;
        fetchSchoolings(params);
    }

    const handleCategoryChange = (selectedOption: { value: number; label: string } | null) => {
        setSelectedCategory(selectedOption);
        params.categoryFilter = selectedOption?.value || undefined;
        fetchSchoolings(params)
    }

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPageNumber(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        params.pageSize = Number(e.target.value);
        params.pageNumber = 1;
        fetchSchoolings(params)
    };


    const handlePageChange = (pageNumber: number) => {
        setPageNumber(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        params.pageNumber = pageNumber;
        fetchSchoolings(params);
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, pageNumber - Math.floor(maxVisiblePages / 2));
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
                    active={i === pageNumber}
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

    const handlePageSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPage = Number(e.target.value);
        setPageNumber(newPage);
        params.pageNumber = newPage;
        fetchSchoolings(params);
    };

    const mapCategory = (categoryId: number | undefined): string => {
        if (!categories) return "Unknown Category";
        const category = categories.find(cat => cat.id === categoryId);
        return category && category.name ? category.name.substring(0, 15)+"..." : "Unknown Category";
    }

    
    const handleSelectSchooling = (schoolingId: number | null) => {
        if (schoolingId === null) {
            handleClose();
            return;
        }
        else {
            setSelectedSchooling(schoolings.items.find(s => s.id === schoolingId) || null);
            handleShow();
        }
    };

    const handleSwitchSchoolingOwner = () => {
        setMyCreatedSchoolings(prev => !prev);
    }

    const handleSwitchSubscribedSchoolings = () => {
        setSubscribedSchooling(prev => !prev);
    }

    const navigateToSchooling = () => {
        navigate(`/Schooling/${selectedSchooling?.id}`);
    }
    return (
        <div className="container schooling-list">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center justify-content-between">
                <Form.Group controlId="itemsPerPage" className="d-flex align-items-center order-1">
                    <Form.Label className="me-2 mb-0">Schooling per page:</Form.Label>
                    <Form.Select 
                        value={pageSize}
                        onChange={handleItemsPerPageChange}
                        style={{ width: 'auto' }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="pageSelect" className="d-flex align-items-center order-2 order-lg-3">
                    <Form.Label className="me-2 mb-0">Page:</Form.Label>
                    <Form.Select
                        value={pageNumber}
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
                <div className='flex-grow-1 order-3 order-lg-2 w-50'>
                    <InputGroup>
                        <Form.Control
                            placeholder="Enter searching title..."
                            value={searchTitle} 
                            onChange={(e) => setSearchTitle(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchBar()}
                        />
                        <Button variant="primary" id="searchButton" onClick={handleSearchBar}> 
                            <i className="bi bi-search">&nbsp;</i>Search 
                        </Button>
                    </InputGroup>
                </div>
            </div>
            <hr className="border-2"/>
            <div className="mb-3 row">
                <div className="col-12 col-lg-2 text-start mb-3">
                    <h4>Filters</h4>    
                    <hr/>
                    
                    <Form.Group className="text-start m-0 mb-3 fs-6">
                        <Form.Check
                            type="switch"
                            label="Subscribed"
                            checked={subscribedSchooling}
                            onChange={() => handleSwitchSubscribedSchoolings()}
                        />
                    </Form.Group>
                    <Form.Group className="text-start m-0 mb-3 fs-6">
                        <Form.Check
                            type="switch"
                            label="Created Schoolings"
                            checked={myCreatedSchoolings}
                            onChange={() => handleSwitchSchoolingOwner()}
                        />
                    </Form.Group>
                    <hr/>
                    <label className="mb-2 fs-6">Filtr by Category:</label>
                    <Select
                        components={animatedComponents}
                        options={options}
                        isClearable={true}
                        isMulti={false}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        styles={{
                                option: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                                multiValueLabel: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                            }}
                    />
                </div>
                <div className="col-12 col-lg-10 d-flex">
                    <div className="w-100">
                        {schoolings.items.map((schooling) => (
                            <span key={schooling.id} onClick={() => handleSelectSchooling(schooling.id || null)} >
                                <SchoolingListItem 
                                    schooling={schooling} 
                                    mapCategory={mapCategory}
                                />
                            </span>
                        ))}
                        <div className="d-flex justify-content-center align-items-center mt-3">
                            <Pagination className="mb-0">
                                <Pagination.Prev
                                    onClick={() => handlePageChange(pageNumber - 1)}
                                    disabled={pageNumber === 1}
                                />
                                {renderPaginationItems()}
                                <Pagination.Next
                                    onClick={() => handlePageChange(pageNumber + 1)}
                                    disabled={pageNumber === totalPages}
                                />
                            </Pagination>
                        </div>
                    </div>
                    <div className={`right-sidebar ${show ? "show" : "hide"} card`}>
                        <div className="d-flex  align-items-center justify-content-between mt-2 me-2">
                            <Button 
                                variant="success" 
                                className="btn-sm me-2 ms-2 ps-3 pe-3"
                                onClick={() => navigateToSchooling()}
                            >Visit</Button>
                            <div className="d-flex">
                                <Dropdown className="me-2">
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" size="sm">
                                        Action
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Subscribe</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Unsubscribe</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#/action-3">Edit</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <CloseButton onClick={handleClose} className="fs-5"/>
                            </div>
                        </div>
                        <div className="border-1 border-top mt-2">
                            <div className="m-2">
                                <h6 className="fw-medium">{selectedSchooling ? selectedSchooling.title : "Select a schooling to view details"}</h6>
                                <div className="fw-light text-secondary-emphasis"><p>Priority: <span>{selectedSchooling?.priority}</span></p></div>
                                <div className="card text-bg-primary">
                                    <p className="p-2">{selectedSchooling?.shortDescription}</p>
                                </div>
                            </div>
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SchoolingList;