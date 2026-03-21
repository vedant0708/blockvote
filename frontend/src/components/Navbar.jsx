import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Vote, LogIn, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';

const Navigation = ({ auth }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!auth?.token;
  const userRole = auth?.role;

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="py-3">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold">
          <Vote className="me-2" size={22} />
          <span className="text-uppercase" style={{ letterSpacing: '0.06em' }}>Blockvote</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-lg-2">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/results">Results</Nav.Link>
            <Nav.Link as={Link} to="/help">Help</Nav.Link>
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <Nav.Link as={Link} to="/login">
                <Button variant="primary" size="sm" className="d-flex align-items-center px-3">
                  <LogIn size={16} className="me-1" /> Login
                </Button>
              </Nav.Link>
            ) : (
              <>
                {userRole === 'voter' ? (
                  <>
                    <Nav.Link as={Link} to="/dashboard">
                      <LayoutDashboard size={18} className="me-1" /> Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/profile">
                      <User size={18} className="me-1" /> Profile
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/admin">
                    <Settings size={18} className="me-1" /> Admin
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout}>
                  <Button variant="outline-danger" size="sm" className="d-flex align-items-center px-3">
                    <LogOut size={16} className="me-1" /> Logout
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
