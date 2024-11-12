import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';

interface FaqDto {
    id?: number;
    title: string;
    answer: string;
    materialsId?: number | null;
}

const FaqAdd: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const faqData: FaqDto = {
            title,
            answer,
        };

        try {
            const response = await axiosInstance.post('/Faq/Add', faqData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Success: ' + response);
            setTitle('');
            setAnswer('');
        } catch (error) {
            console.log(error)
        }
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
