import React, { useState, useEffect } from 'react';
import { FaqDto, FaqResponse } from '../../dtos/FaqDto';
import { addFaq, editFaq } from '../../services/faqService';
import './FaqEdit.css';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../Provider/authProvider';
import MaterialItem from '../MaterialManager/MaterialItem';

interface FaqEditProps {
    isEditMode: boolean; 
    faq?: FaqDto;  
    onFaqEdited: (response: FaqResponse) => void;
    onCancel: () => void;
}

export default function FaqEdit({ faq, isEditMode, onCancel, onFaqEdited }: FaqEditProps): React.ReactElement {
    const { user } = useAuth();
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [materialId, setMaterialId] = useState<number | null>(null);

    const [isQuestionValid, setQuestionValidation] = useState<boolean>(false);
    const [isAnswerValid, setAnswerValidation] = useState<boolean>(false);

    const validateQuestion = (value: string) => {
        setQuestionValidation(/^[A-Z].*\?$/.test(value) && value.length >= 5);
        setQuestion(value);
    };

    const validateAnswer = (value: string) => {
        setAnswerValidation(value.length >= 10);
        setAnswer(value);
    };

    useEffect(() => {
        if (faq) {
            setQuestion(faq.question);
            setAnswer(faq.answer);
            setMaterialId(faq.materialId ?? null);
            setQuestionValidation(true)
            setAnswerValidation(true)
        }
    }, [faq]);

    const materialCreated = (materialId: number) => {
        setMaterialId(materialId);
        console.log('materialId', materialId);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isQuestionValid || !isAnswerValid) {
            return;
        }

        const faqDto: FaqDto = {
            id: isEditMode ? faq!.id : 0,
            question: question ?? '',
            answer: answer ?? '',
            materialId: materialId,
            creatorId:  user?.id || '',
        };

        try {
            const response = isEditMode 
                ? await editFaq(faqDto) 
                : await addFaq(faqDto);
            onFaqEdited(response);
            setQuestion('');
            setAnswer('');
            setMaterialId(null);
        } catch (error) {
            console.error('Error saving FAQ:', error);
        }
    };

    return (
        <section className='editBoxFaq'>
            <form onSubmit={handleSubmit} className="container-lg">
                <div className="form-group">
                    <label htmlFor="question">Question:</label>
                    <input
                        type="text"
                        id="question"
                        className={`form-control ${!isQuestionValid ? 'is-invalid' : ''}`}
                        value={question}
                        onChange={(e) => validateQuestion(e.target.value)}
                        required
                    />
                    {!isQuestionValid && (
                        <div className="invalid-feedback">
                            The question must start with a capital letter, be at least 5 characters long, and end with "?"
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
                <div >
                    <MaterialItem
                        materialId={materialId ?? 0} 
                        materialCreated={materialCreated} 
                        enableAddingFile={true}
                        enableDownloadFile={true}
                        enableRemoveFile={true}
                        enableEdittingMaterialName={true}
                        >
                    </MaterialItem>
                </div>
                <div className='buttonBoxFaq'>
                    <Button variant="secondary" onClick={() => onCancel()}>
                        Cancel 
                    </Button >
                    <Button type="submit" variant="success" disabled={!isQuestionValid || !isAnswerValid}>
                        {isEditMode ? 'Save Changes' : 'Add new FAQ'}
                    </Button >
                </div>
            </form>
        </section>
    );
};