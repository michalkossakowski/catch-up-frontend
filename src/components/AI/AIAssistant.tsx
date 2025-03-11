import { useState } from "react";
import { GetAIChatResponse } from "../../services/aiService";
import { Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AIAssistant.css';

interface AIAssistantProps {
  show: boolean;
  onHide: () => void;
}

export default function AIAssistant({ show, onHide }: AIAssistantProps): React.ReactElement {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '\n').replace(/\*/g, '\n');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const userMessage = {
        text: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      const aiResponseText = await GetAIChatResponse(message);
      const cleanedResponseText = cleanText(aiResponseText);
      const aiResponse = {
        text: cleanedResponseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiResponse]);
      setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`chat-window ${show ? 'show' : 'hide'}`}>
      <Card.Header className="ai-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0"><i className="bi bi-stars"/> AI assistant</h6>
        <Button variant="link" className="text-white p-0" onClick={onHide}>
          <i className="bi bi-x-lg" />
        </Button>
      </Card.Header>

      <Card.Body className="chat-body">
        {messages.length === 0 && !loading && !error && (
          <div className="empty-chat-prompt">
            Ask AI about anything...
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex ${
              msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
            }`}
          >
            <div className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
              <p className="mb-1">{msg.text}</p>
              <small className="timestamp">{msg.timestamp}</small>
            </div>
          </div>
        ))}
          {messages.length != 0 && !loading && !error && (
          <div className="empty-chat-prompt">
            You can ask another question...
          </div>
        )}
        {loading && (
          <div className="d-flex justify-content-center m-2">
            <Spinner animation="border" variant="primary" size="sm" />
          </div>
        )}
        {error && (
          <div className="text-center text-danger error-text">
            Error: {error}
          </div>
        )}
      </Card.Body>

      <Card.Footer className="ai-footer">
        <Form onSubmit={handleSendMessage}>
          <Row className="align-items-center">
            <Col xs={9}>
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your question..."
                disabled={loading}
                size="sm"
              />
            </Col>
            <Col xs={3}>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !message.trim()}
                className="w-100"
                size="sm"
              >
                Ask AI
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Footer>
    </Card>
  );
}