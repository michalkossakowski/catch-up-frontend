import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FaqComponent from './FaqComponent';
import * as faqService from '../../services/faqService';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../../services/faqService');
jest.mock('./FaqItem', () => {
  return jest.fn(({ faq, index, editClick, deleteClick, isAdmin }) => (
    <div data-testid={`faq-item-${index}`}>
      <h3>{faq.question}</h3> {/* Match actual FaqItem rendering */}
      {isAdmin && (
        <>
          <button onClick={() => editClick(faq.id)} data-testid={`edit-${faq.id}`}>
            Edit
          </button>
          <button onClick={() => deleteClick(faq.id)} data-testid={`delete-${faq.id}`}>
            Delete
          </button>
        </>
      )}
    </div>
  ));
});
jest.mock('../Loading/Loading', () => {
  return jest.fn(() => <div data-testid="loaderBox">Loading...</div>);
});
jest.mock('../Toast/NotificationToast', () => {
  return jest.fn(({ show, title, message, onClose }) =>
    show ? <div data-testid="toast">{message}</div> : null
  );
});
jest.mock('../Modal/ConfirmModal', () => {
  return jest.fn(({ show, title, message, onConfirm, onCancel }) =>
    show ? (
      <div data-testid="confirm-modal">
        <span>{message}</span>
        <button onClick={onConfirm} data-testid="confirm-button">Confirm</button>
        <button onClick={onCancel} data-testid="cancel-button">Cancel</button>
      </div>
    ) : null
  );
});

describe('FaqComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (faqService.getFaqs as jest.Mock).mockResolvedValue({ faqs: [], totalCount: 0 });
  });

  test('renders without crashing', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter searching question...')).toBeInTheDocument();
    });
  });

  test('shows Add new FAQ button only for admin', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={true} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Add new FAQ')).toBeInTheDocument();
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Add new FAQ')).not.toBeInTheDocument();
    });
  });

  test('displays FAQs when fetched successfully', async () => {
    const mockFaqs = [{ id: 1, question: 'Q1', answer: 'A1' }];
    (faqService.getFaqs as jest.Mock).mockResolvedValue({ faqs: mockFaqs, totalCount: 1 });

    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('faq-item-0')).toBeInTheDocument();
      expect(screen.getByText('Q1')).toBeInTheDocument();
    });
  });

  test('shows error alert when fetching FAQs fails', async () => {
    (faqService.getFaqs as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('toast')).toHaveTextContent('Error: Fetch error');
    });
  });

  test('searches FAQs correctly', async () => {
    const mockFaqs = [{ id: 1, question: 'Question 1', answer: 'Answer 1' }];
    (faqService.getBySearch as jest.Mock).mockResolvedValue(mockFaqs);

    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter searching question...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter searching question...');
    const searchButton = screen.getByText('Search');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Question 1' } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('faq-item-0')).toBeInTheDocument();
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Cancel search')).toBeInTheDocument();
    });
  });

  test('displays no results message when search returns empty', async () => {
    (faqService.getBySearch as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter searching question...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter searching question...');
    const searchButton = screen.getByText('Search');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("No Questions with: 'Nonexistent' inside found.")).toBeInTheDocument();
    });
  });

  test('resets search and fetches all FAQs', async () => {
    const mockFaqs = [{ id: 1, question: 'Q1', answer: 'A1' }];
    (faqService.getBySearch as jest.Mock).mockResolvedValue([]);
    (faqService.getFaqs as jest.Mock).mockResolvedValue({ faqs: mockFaqs, totalCount: 1 });

    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter searching question...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter searching question...');
    const searchButton = screen.getByText('Search');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Cancel search')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel search');

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('faq-item-0')).toBeInTheDocument();
      expect(screen.getByText('Q1')).toBeInTheDocument();
    });
  });

  test('handles FAQ deletion as admin', async () => {
    const mockFaqs = [{ id: 1, question: 'Q1', answer: 'A1' }];
    (faqService.getFaqs as jest.Mock).mockResolvedValue({ faqs: mockFaqs, totalCount: 1 });
    (faqService.deleteFaq as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      render(
        <MemoryRouter>
          <FaqComponent isAdmin={true} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('faq-item-0')).toBeInTheDocument();
      expect(screen.getByText('Q1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-1');

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this FAQ?')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('confirm-button');

    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('toast')).toHaveTextContent('FAQ successfully deleted!');
    });
  });

  test('handles search phrase from location', async () => {
    const mockFaqs = [{ id: 1, question: 'Search Q', answer: 'A' }];
    (faqService.getBySearch as jest.Mock).mockResolvedValue(mockFaqs);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/', state: { searchPhrase: 'Search' } }]}>
          <FaqComponent isAdmin={false} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('faq-item-0')).toBeInTheDocument();
      expect(screen.getByText('Search Q')).toBeInTheDocument();
    });
  });
});