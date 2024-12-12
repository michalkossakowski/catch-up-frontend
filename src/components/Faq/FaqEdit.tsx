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
    onCancel: () => void;
}

export default function FaqEdit({ faq, isEditMode, onCancel, onFaqEdited }: FaqEditProps): React.ReactElement {

    const [title, setTitle] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [materialsId, setMaterialsId] = useState<number | null>(null);

    const [isTitleValid, setTitleValidation] = useState<boolean>(true);
    const [isAnswerValid, setAnswerValidation] = useState<boolean>(true);

    const validateTitle = (value: string) => {
        setTitleValidation(/^[A-Z].*\?$/.test(value));
        setTitle(value);
    };

    const validateAnswer = (value: string) => {
        setAnswerValidation( value.length >= 10);
        setAnswer(value);
    };

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

        if (!isTitleValid || !isAnswerValid) {
            return;
        }

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
                <h2>{isEditMode ? 'Edit FAQ' : 'Add new FAQ'}</h2>
                <br />
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        className={`form-control ${!isTitleValid ? 'is-invalid' : ''}`}
                        value={title}
                        onChange={(e) => validateTitle(e.target.value)}
                        required
                    />
                    {!isTitleValid && (
                        <div className="invalid-feedback">
                            The title must start with a capital letter, be at least 5 characters long, and end with "?"
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="answer">Answer:</label>
                    <textarea
                        id="answer"
                        className={`form-control ${!isAnswerValid ? 'is-invalid' : ''}`}
                        value={answer}
                        onChange={(e) => validateAnswer(e.target.value)}
                        rows={8}
                        required
                    />
                    {!isAnswerValid && (
                        <div className="invalid-feedback">
                            The answer must be at least 10 characters long
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label>Additonal Materials:</label>
                    <Material
                        materialId={materialsId ?? 0}
                        showRemoveFile={true}
                        showDownloadFile={true}
                        showAddingFile={true}
                        materialCreated={materialCreated}
                    />
                </div>
                <div className='buttonBox'>
                    <Button type="submit" variant="primary">
                        {isEditMode ? 'Save Changes' : 'Add new FAQ'}
                    </Button >
                    <Button type="submit" variant="danger" onClick={() => onCancel()}>
                        Cancel 
                    </Button >
                    {materialsId &&(
                        <Button variant="secondary" onClick={() => setMaterialsId(null)}>
                            Remove materials
                        </Button>
                    )}
                </div>


            </form>
        </section>
    );
};