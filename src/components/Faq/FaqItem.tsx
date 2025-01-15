import { Accordion, Button } from 'react-bootstrap';
import { FaqDto } from '../../dtos/FaqDto';
import Material from '../Material/Material';

type FaqProps = {
    faq: FaqDto;
    index: number;
    isAdmin: boolean;
    editClick: (id: number) => void;
    deleteClick: (id: number) => void;
}

export default function FaqItem(props: FaqProps): React.ReactElement {

    return(
        <>
            <Accordion.Item eventKey={props.faq.id.toString()} key={props.faq.id} data-material-id={props.faq.materialId}>
                <Accordion.Header>
                    {props.index}. {props.faq.question}
                </Accordion.Header>
                <Accordion.Body>
                    <p>{props.faq.answer}</p>

                    {props.faq.materialId && (
                        <div>
                            Additional materials:
                            <Material materialId={props.faq.materialId} showDownloadFile={true}/>
                        </div>  
                    )}

                    {props.isAdmin && (
                        <div className='buttonBox'>
                            <Button
                                variant="primary"
                                onClick={() => props.editClick(props.faq.id)}>
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => props.deleteClick(props.faq.id)}>
                                Delete
                            </Button>
                        </div>
                    )}
                </Accordion.Body>
            </Accordion.Item>
        </>
    );
}  

