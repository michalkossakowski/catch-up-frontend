
import { FaqDto, FaqResponse } from '../dtos/FaqDto';

let faqs: FaqDto[] = [
    { id: 1, question: 'What is Catch-up?', answer: 'A platform to help you stay up-to-date with your work.', creatorId: '1' },
    { id: 2, question: 'How do I use it?', answer: 'Just browse the different sections and see what you can do.', creatorId: '1' },
    { id: 3, question: 'Is it free?', answer: 'Yes, it is free to use.', creatorId: '1' },
];

export const getFaqs = async (page: number, pageSize: number): Promise<{ faqs: FaqDto[], totalCount: number }> => {
    console.log(`Mocked getFaqs called with page: ${page}, pageSize: ${pageSize}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const paginatedFaqs = faqs.slice((page - 1) * pageSize, page * pageSize);
    return { faqs: paginatedFaqs, totalCount: faqs.length };
};

export const getById = async (id: string): Promise<FaqDto[]> => {
    console.log(`Mocked getById called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return faqs.filter(f => f.id === parseInt(id));
};

export const getBySearch = async (searchPhrase: string): Promise<FaqDto[]> => {
    console.log(`Mocked getBySearch called with searchPhrase: ${searchPhrase}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return faqs.filter(f => (f.question.toLowerCase().includes(searchPhrase.toLowerCase()) || f.answer.toLowerCase().includes(searchPhrase.toLowerCase())));
};

export const addFaq = async (faq: FaqDto): Promise<FaqResponse> => {
    console.log('Mocked addFaq called with faq:', faq);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newFaq: FaqDto = { ...faq, id: Math.max(...faqs.map(f => f.id)) + 1 };
    faqs.push(newFaq);
    return { message: 'FAQ added successfully', faq: newFaq };
};

export const editFaq = async (faq: FaqDto): Promise<FaqResponse> => {
    console.log('Mocked editFaq called with faq:', faq);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = faqs.findIndex(f => f.id === faq.id);
    if (index === -1) {
        throw new Error('FAQ not found');
    }
    faqs[index] = faq;
    return { message: 'FAQ edited successfully', faq: faqs[index] };
};

export const deleteFaq = async (id: number): Promise<any> => {
    console.log(`Mocked deleteFaq called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    faqs = faqs.filter(f => f.id !== id);
    return { message: 'FAQ deleted successfully' };
};
