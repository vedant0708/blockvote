import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { adminService } from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.login(formData);
      const { token, admin } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      localStorage.setItem('admin_email', admin.email);
      localStorage.setItem('full_name', admin.full_name);
      
      // Dispatch custom event to update App.jsx state
      window.dispatchEvent(new Event('auth-change'));
      
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <div className="mb-4">
            <Button as={Link} to="/login" variant="link" className="text-muted p-0 text-decoration-none d-flex align-items-center">
              <ArrowLeft size={16} className="me-2" /> Back to Voter Login
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="bg-dark bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
              <ShieldCheck size={40} className="text-dark" />
            </div>
            <h2 className="fw-bold">Admin Portal</h2>
            <p className="text-muted">Secure access for system administrators</p>
          </div>

          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              {error && <Alert variant="danger" className="small">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Admin Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <Form.Control 
                      type="email" 
                      name="email" 
                      placeholder="admin@voteledger.com" 
                      value={formData.email}
                      onChange={handleChange}
                      className="border-start-0 ps-0"
                      required 
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <Form.Control 
                      type="password" 
                      name="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleChange}
                      className="border-start-0 ps-0"
                      required 
                    />
                  </div>
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100 py-3 fw-bold shadow-sm" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Secure Login'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-muted small">
              <Lock size={14} className="me-1" /> This is a restricted area. All access is logged and monitored.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
