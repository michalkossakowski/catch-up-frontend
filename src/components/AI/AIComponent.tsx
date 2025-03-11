import { useState } from "react";
import { GetAIChatResponse } from "../../services/aiService";
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AIComponent(): React.ReactElement {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // Add user message
      const userMessage = {
        text: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      const aiResponseText = await GetAIChatResponse(message);
      const aiResponse = {
        text: aiResponseText,
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
    <Container className="py-4" style={{ maxWidth: '800px', height: '80vh' }}>
      <Card className="h-100 shadow">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Grok Chat</h5>
        </Card.Header>

        <Card.Body 
          style={{ 
            overflowY: 'auto',
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex ${
                msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
              }`}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px 15px',
                  borderRadius: '10px',
                  background: msg.sender === 'user' ? '#007bff' : '#ffffff',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <p className="mb-1">{msg.text}</p>
                <small 
                  style={{ 
                    opacity: 0.7,
                    display: 'block',
                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                  }}
                >
                  {msg.timestamp}
                </small>
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          {error && (
            <div className="text-center text-danger">
              Error: {error}
            </div>
          )}
        </Card.Body>

        <Card.Footer>
          <Form onSubmit={handleSendMessage}>
            <Row className="align-items-center">
              <Col xs={9}>
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                  disabled={loading}
                />
              </Col>
              <Col xs={3}>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="w-100"
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
}