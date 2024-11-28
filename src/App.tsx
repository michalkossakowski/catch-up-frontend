import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import AuthProvider, { useAuth } from './Provider/authProvider';
import ProtectedRoute from './Routes/ProtectedRoute';
import LoginPage from './components/Login/LoginComponent';
import FaqComponent from './components/Faq/FaqComponent';
import Material from './components/Material/Material';
import FaqManage from './components/Faq/FaqManage';

// Create a separate component for the navbar and routes
const AppContent = () => {
    const { user } = useAuth();

    const materialCreated = (materialId: number) => {
        console.log('Zwrócono id nowo utworzonego materiału', materialId);
        return materialId;
    };

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary navbar-expand-lg">
                <Container>
                    <Navbar.Brand href="/">catchUp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/" onClick={() => 'Home'}>Home</Nav.Link>
                            <Nav.Link href="/faq" onClick={() =>'Faq'}>Faq</Nav.Link>
                            <Nav.Link href="/faqmanage" onClick={() => 'FaqManage'}>FaqManage</Nav.Link>
                            <Nav.Link href="/addfile" onClick={() => 'AddFile'}>AddFile</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <h1>Welcome back {user?.name || 'UserNameNotFound'}</h1>
                        </ProtectedRoute>
                    }
                />
                <Route path="/faq" element={<ProtectedRoute><FaqComponent isAdmin={false} /></ProtectedRoute>} />
                <Route path="/faqmanage" element={<ProtectedRoute><FaqManage /></ProtectedRoute>} />
                <Route path="/addfile" element={
                    <ProtectedRoute>
                        <Material
                            materialId={1060}
                            showRemoveFile={true}
                            showDownloadFile={true}
                            showAddingFile={true}
                            materialCreated={materialCreated}
                        />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <footer className="py-3 my-4 border-top">
                <p className="text-center text-muted">© 2024 UnhandledException</p>
            </footer>
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;