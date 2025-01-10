import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import * as Yup from 'yup';
import { SchoolingPartDto } from "../../dtos/SchoolingPartDto";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import NotificationToast from "../Toast/NotificationToast";
import { Formik, FormikProps } from "formik";
import schoolingService from "../../services/schoolingService";
import { setSchooling } from "../../store/schoolingSlice";
import { FullSchoolingDto } from "../../dtos/FullSchoolingDto";
import Loading from "../Loading/Loading";

const SchoolingPartEdit: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling)
    const { id } = useParams()
    const [editedPart, setEditedPart] = useState<SchoolingPartDto>()
    
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if(id){
            setEditedPart(  fullSchooling?.parts?.find(part => part?.id?.toString() === id))
            setLoading(false)
        }
        else
            setLoading(false)
    }, []);

    const schema = Yup.object().shape({
        name: Yup.string().required('Title is required'),
        content: Yup.string(),
    });

    interface PartFormValues {
        name: string;
        content: string;
    }

    const goToBack = () => {
        navigate('/schoolinglistparts')
    }
    const handleSubmit = async (values: PartFormValues) => {
        const part: SchoolingPartDto = {
            id: editedPart?.id ?? undefined,
            name: values.name,
            content: values.content,
            materials: []
        }
        try {
            if (id && fullSchooling) {
                await schoolingService.editSchoolingPart(part)                
                const updatedParts = fullSchooling.parts?.map(p => p.id === part.id ? {... p, ...part} : p)
                const updatedSchooling: FullSchoolingDto = {
                    ...fullSchooling,
                    parts: updatedParts || []

                }
                dispatch(setSchooling(updatedSchooling));
                setToastMessage("Schooling part edited successfully");
            } else {
                if( fullSchooling?.schooling?.id)
                {
                    const createdPart = await schoolingService.createSchoolingPart(part, fullSchooling?.schooling?.id)

                    const updatedParts = [...(fullSchooling?.parts || []), createdPart];

                    const updatedSchooling: FullSchoolingDto = {
                        ...fullSchooling,
                        parts: updatedParts,
                    };  
                    dispatch(setSchooling(updatedSchooling));
                    setToastMessage("Schooling part created successfully");
                }              
            }
            setShowAlert(false);
        } catch (error: any) {
            setShowAlert(true);
            setAlertMessage(`Error: ${error.message}`);
        } finally {
            setShowToast(true);
            navigate('/schoolinglistparts')
        }
    }
    return(
        <section className="container">
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
            {!loading && (
            <Formik
                validationSchema={schema}
                    initialValues={{
                    name:  editedPart?.name || '',
                    content: editedPart?.content || '',
                    }}
                onSubmit={handleSubmit}
            >
                {(props: FormikProps<PartFormValues>) => {
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
                                    <Form.Group controlId="name">
                                        <Form.Label>Part Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter part name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.name && !!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={12}>
                                    <Form.Group controlId="content">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter content"
                                            name="content"
                                            style={{ height: '200px' }}
                                            value={values.content}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center">
                                <div className="d-flex justify-content-between btn-group w-50" role="group">
                                    <Button variant="outline-danger" onClick={() => goToBack()}><i className="bi-arrow-left-square fs-5"></i></Button>
                                    <Button variant="primary"  type="submit" className="fs-5">{fullSchooling ? 'Save' : 'Create'}</Button>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            )}
            <NotificationToast 
                show={showToast} 
                title={"Schooling part operation info"} 
                message={toastMessage} 
                color={"green"} 
                onClose={() => setShowToast(false)} />
        </section>
    )
}
export default SchoolingPartEdit;