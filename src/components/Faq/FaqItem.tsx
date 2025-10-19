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
                            />
                        </div>  
                    )}

                <div className='mt-3 justify-content-between d-flex'>
                    <FeedbackButton resourceId={props.faq.id} resourceType={ResourceTypeEnum.Faq} receiverId={props.faq.creatorId} />
                    {props.isAdmin && (
                        <div>
                            <Button 
                                variant="danger"
                                onClick={() => props.deleteClick(props.faq.id)}>
                                <i className='bi-trash' style={{color: 'white'}}></i> Delete
                            </Button>
                            <Button className='ms-2'
                                variant="primary"
                                onClick={() => props.editClick(props.faq.id)}>
                                <i className='bi-pencil' style={{color: 'white'}}></i> Edit
                            </Button>
                        </div>
                    )}
                 
                </div>
                </Accordion.Body>
            </Accordion.Item>
        </>
    );
}  

