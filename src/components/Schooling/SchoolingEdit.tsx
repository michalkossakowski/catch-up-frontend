import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { getCategories } from "../../services/categoryService";
import { CategoryDto } from "../../dtos/CategoryDto";
import schoolingService from "../../services/schoolingService";
import { SchoolingDto } from "../../dtos/SchoolingDto";
import Loading from "../Loading/Loading";
import NotificationToast from "../Toast/NotificationToast";
import { useAuth } from "../../Provider/authProvider";
import { useNavigate } from "react-router-dom";
import { setSchooling } from "../../store/schoolingSlice";

const SchoolingEdit: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const [loading, setLoading] = useState(true)

    const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);

    const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling);
    const { user } = useAuth();
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(() => {
        init()
    }, []);

    const init = async () => {
        getCategoryList()
            .then((data) => {
                setAvailableCategories(data);
                setLoading(false)
            })
            .catch((error) => {
                setShowAlert(true);
                setAlertMessage('Error: ' + error.message);
                setLoading(false)
            })

        if(!user){
            setShowAlert(true);
            setAlertMessage('Error: cannot confirm user');
            setLoading(false)
        }
    }

    const getCategoryList = async () => {
        try {
            const categoryData = await getCategories();
            return categoryData;
        } catch (error) {
            throw error;
        }
    }

    const schema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        categoryId: Yup.number()
            .required('Category is required')            
            .min(1, 'Category is required'),
        priority: Yup.number()
            .typeError('Priority must be a number')
            .required('Priority is required')
            .min(0, 'Priority must be at least 0'),
        description: Yup.string(),
    });

    interface SchoolingFormValues {
        title: string;
        categoryId: number;
        priority: number;
        description: string;
    }

    const handleSubmit = async (values: SchoolingFormValues) => {
        const schooling: SchoolingDto = {
            id: fullSchooling?.schooling?.id ?? undefined,
            title: values.title,
            categoryId: values.categoryId,
            priority: values.priority,
            shortDescription: values.description,
            creatorId: fullSchooling?.schooling?.creatorId ?? user?.id,
        };
    
        try {
            if (fullSchooling) {
                await schoolingService.editSchooling(schooling);
                const updatedSchooling = {
                    ...fullSchooling,
                    schooling,
                };
                dispatch(setSchooling(updatedSchooling));
                setToastMessage("Schooling edited successfully");
            } else {
                const createdSchooling = await schoolingService.createSchooling(schooling);
                dispatch(setSchooling(createdSchooling));
                setToastMessage("Schooling created successfully");
            }
            setShowAlert(false);
        } catch (error: any) {
            setShowAlert(true);
            setAlertMessage(`Error: ${error.message}`);
        } finally {
            setShowToast(true);
        }
    }
    
    const goToBack = () => {
        navigate('/schoolinglist')
    }
    const goToEditSchoolingParts = () => {
        navigate('/schoolinglistparts')
    }

    return (
        <section className="container mt-3">
            {showAlert &&(
                <div className="mb-3">
                    <Alert className='alert' variant='danger'>
                        {alertMessage}
                    </Alert>
                </div>
            )}
            {loading && (
                <div className='mt-3'>
                    <Loading/>
                </div>
            )}
            {!loading &&(
            <Formik
                validationSchema={schema}
                initialValues={{
                    title: fullSchooling?.schooling?.title || '',
                    categoryId: fullSchooling?.category?.id || 0,
                    priority: fullSchooling?.schooling?.priority || 0,
                    description: fullSchooling?.schooling?.description || '',
                }}
                onSubmit={handleSubmit}
            >
                {(props: FormikProps<SchoolingFormValues>) => {
                    const {
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        errors,
                        touched,
                    } = props;

                    return (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col md={12}>
                                    <Form.Group controlId="title">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter title"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.title && !!errors.title}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.title}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group controlId="categoryId" as={Col} className='col-6'>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        name="categoryId"
                                        value={values.categoryId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.categoryId && !!errors.categoryId}
                                    >
                                        <option value="0">-- Select Category --</option>
                                        {availableCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.categoryId}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="priority" as={Col} className='col-6'>
                                    <Form.Label>Priority</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter priority"
                                        name="priority"
                                        value={values.priority}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.priority && !!errors.priority}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.priority}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-4">
                                <Col md={12}>
                                    <Form.Group controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter description"
                                            name="description"
                                            style={{ height: '200px' }}
                                            value={values.description}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center">
                                <div className="d-flex justify-content-between btn-group w-50" role="group">
                                    <Button variant="outline-danger" onClick={() => goToBack()}><i className="bi-arrow-left-square fs-5"></i></Button>
                                    <Button variant="primary"  type="submit" className="fs-5">{fullSchooling ? 'Save' : 'Create'}</Button>
                                    <Button variant="outline-light"  onClick={() => goToEditSchoolingParts()} disabled={!fullSchooling}><i className="bi-arrow-right-square fs-5"></i></Button>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            )}
            <NotificationToast 
                show={showToast} 
                title={"Schooling operation info"} 
                message={toastMessage} 
                color={"green"} 
                onClose={() => setShowToast(false)} />
        </section>
    )
}

export default SchoolingEdit;
