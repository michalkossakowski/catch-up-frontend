import React, { useState, useEffect } from 'react';
import { FaqDto } from '../../dtos/FaqDto';
import Material from '../Material/Material';
import { editFaq } from '../../services/faqService';

interface FaqEditProps {
    faq: FaqDto; 
    onFaqEdited: () => void;
}

const FaqEdit: React.FC<FaqEditProps> = ({ faq, onFaqEdited }) => {
    const [title, setTitle] = useState<string>(faq.title);
    const [answer, setAnswer] = useState<string>(faq.answer);
    const [materialsId, setMaterialsId] = useState<number | null>(faq.materialsId ?? null);

    useEffect(() => {
        setTitle(faq.title);
        setAnswer(faq.answer);
        setMaterialsId(faq.materialsId ?? null);
    }, [faq]);

    const materialCreated = (materialId: number) => {
        setMaterialsId(materialId);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedFaq: FaqDto = {
            id: faq.id, 
            title: title,
            answer: answer,
            materialsId: materialsId,
        };

        editFaq(updatedFaq)
            .then(() => {
                onFaqEdited();
            })
            .catch((error) => {
                console.error('Error updating FAQ:', error);
            });
    };

    return (
        <section>
            <form onSubmit={handleSubmit} className="container-lg text-left">
                <h2>Edit FAQ</h2>
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
                        rows={2}
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

                <br />
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </section>
    );
};

export default FaqEdit;
