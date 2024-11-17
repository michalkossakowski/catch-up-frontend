import React, { useState } from 'react';
import { FaqDto } from '../../dtos/faqDto';
import Material from '../Material/Material';
import { addFaq } from '../../services/faqService';


const FaqAdd: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [materialsId, setMaterialsId] = useState<number|null>();
    const materialCreated = (materialId: number) => {
        setMaterialsId(materialId)
    }      

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const faq: FaqDto = {
            id: 0,
            title: title,
            answer: answer,
            materialsId: materialsId
        };

        addFaq(faq)
        .then((data) => {
            console.log('Success: ' + data);
            setTitle('');
            setAnswer('');
            setTitle('');
            setMaterialsId(null);
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {});

    };

    return (
        <>
            <section>
                <form onSubmit={handleSubmit} className="container-lg text-left">
                    <h2>Add FAQ</h2>
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

                    <Material materialId={materialsId ?? 0} showRemoveFile={true} showDownloadFile={true} showAddingFile={true} materialCreated={materialCreated}/>

                   
                    {//usuwanie materiałów czeka na Eryka 

                    // {materialsId != 0 && (
                    //     <button type="button" className="btn btn-danger" onClick={() => setMaterialsId(null)}>Remove Materials</button>
                    // )}
                    }

                    <br />
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </section>
        </>
    );
};

export default FaqAdd;
