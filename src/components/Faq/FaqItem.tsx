import { Accordion, Button } from 'react-bootstrap';
import { FaqDto } from '../../dtos/FaqDto';
import Material from '../Material/Material';
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

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
                            <Material materialId={props.faq.materialId} showDownloadFile={true}/>
                        </div>  
                    )}

                <div className='buttonBox'>
                    {props.isAdmin && (
                        <>
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
                        </>

                    )}
                    <FeedbackButton resourceId={props.faq.id} resourceType={ResourceTypeEnum.Faq} receiverId={""} />
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </>
    );
}  

