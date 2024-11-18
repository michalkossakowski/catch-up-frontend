import React, { useState, useEffect } from 'react';
import { FaqDto } from '../../dtos/FaqDto';
import Material from '../Material/Material';
import { addFaq, editFaq } from '../../services/faqService';
import './FaqEdit.css';
import { Button } from 'react-bootstrap';

interface FaqEditProps {
    isEditMode: boolean; 
    faq?: FaqDto;  
    onFaqEdited: () => void;
}

const FaqEdit: React.FC<FaqEditProps> = ({ onFaqEdited, faq, isEditMode }) => {
    const [title, setTitle] = useState<string>();
    const [answer, setAnswer] = useState<string>();
    const [materialsId, setMaterialsId] = useState<number | null>();

    useEffect(() => {
        if (faq) {
            setTitle(faq.title);
            setAnswer(faq.answer);
            setMaterialsId(faq.materialsId ?? null);
        }
    }, [faq]);

    const materialCreated = (materialId: number) => {
        setMaterialsId(materialId);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const faqDto: FaqDto = {
            id: isEditMode ? faq!.id : 0,
            title: title ?? '',
            answer: answer ?? '',
            materialsId: materialsId,
        };

        const updateFaq = isEditMode ? editFaq(faqDto) : addFaq(faqDto);  

        updateFaq
            .then(() => {
                onFaqEdited();
                setTitle('');
                setAnswer('');
                setMaterialsId(null);
            })
            .catch((error) => {
                console.error('Error saving FAQ:', error);
            });
    };

    return (
        <section className='editBox'>
            <form onSubmit={handleSubmit} className="container-lg text-left">
                <h2>{isEditMode ? 'Edit FAQ' : 'Add FAQ'}</h2>
                <br />
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="answer">Answer:</label>
                    <textarea
                        id="answer"
                        className="form-control"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={4}
                        required
                    />
                </div>

                <Material
                    materialId={materialsId ?? 0}
                    showRemoveFile={true}
                    showDownloadFile={true}
                    showAddingFile={true}
                    materialCreated={materialCreated}
                />

                {materialsId &&(
                    <Button variant="danger" onClick={() => setMaterialsId(null)}>
                        Remove materials
                    </Button>
                )}
                <br />
                <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Save Changes' : 'Submit'}
                </button>
            </form>
        </section>
    );
};

export default FaqEdit;
