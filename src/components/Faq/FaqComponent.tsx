import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';
import './FaqComponent.css'; 
import { Accordion } from 'react-bootstrap';

interface FaqDto {
    id: number;
    title: string;
    answer: string;
    materialsId?: number | null;
}

const FaqComponent: React.FC = () => {
    const [faqs, setFaqs] = useState<FaqDto[]>([]);

    const fetchFaqs = async () => {
        try {
            const response = await axiosInstance.get('/Faq/GetAll');
            setFaqs(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    return (
        <>
    <section className="container">
        <h2>Frequently Asked Questions</h2>
        <Accordion className='AccordionItem'>
            {faqs.map((faq) => (
                <Accordion.Item eventKey={faq.id.toString()} key={faq.id}>
                    <Accordion.Header>
                        {faq.id}. {faq.title}
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>{faq.answer}</p>
                        <p>Materials: {faq.materialsId}</p>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    </section>
        </>
    );
};

export default FaqComponent;
