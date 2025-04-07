import { Accordion, Button } from 'react-bootstrap';
import { FaqDto } from '../../dtos/FaqDto';
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import MaterialItem from '../MaterialManager/MaterialItem';

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
                            <MaterialItem 
                                materialId={props.faq.materialId} 
                                enableDownloadFile={true} 
                                enableAddingFile={false}
                                enableRemoveFile={false}
                                enableEdittingMaterialName ={false}
                                enableEdittingFile={false}
                                showMaterialName= {true}
                                nameTitle='See Materials'
                            />
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
                    <FeedbackButton resourceId={props.faq.id} resourceType={ResourceTypeEnum.Faq} receiverId={props.faq.creatorId} />
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </>
    );
}  

