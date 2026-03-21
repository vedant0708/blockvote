import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Key, ShieldCheck, ArrowLeft } from 'lucide-react';
import { adminService } from '../services/api';

const AddVoter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    voter_id: 'VOTE-' + Math.floor(10000 + Math.random() * 90000),
    full_name: '',
    email: '',
    phone: '',
    public_key: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Ensure all required fields are present and clean
    const payload = {
      voter_id: formData.voter_id.trim(),
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      public_key: formData.public_key.trim()
    };

    try {
      await adminService.createVoter(payload);
      setSuccess('Voter registered successfully! Redirecting to biometric enrollment...');
      setTimeout(() => {
        navigate('/admin/enroll-biometric', { state: { voter_id: payload.voter_id } });
      }, 2000);
    } catch (err) {
      console.error('Registration Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error creating voter. Please check if ID/Email already exists.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <Button variant="link" className="text-muted p-0 text-decoration-none d-flex align-items-center" onClick={() => navigate('/admin')}>
              <ArrowLeft size={16} className="me-2" /> Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
              <UserPlus size={32} className="text-primary" />
            </div>
            <h2 className="fw-bold">Register New Voter</h2>
            <p className="text-muted">Enter voter details to initialize registration</p>
          </div>

          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">Voter ID (Auto-generated)</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="voter_id" 
                        value={formData.voter_id} 
                        readOnly 
                        className="bg-light font-monospace"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">Full Name</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-white"><User size={18} className="text-muted" /></span>
                        <Form.Control 
                          type="text" 
                          name="full_name" 
                          placeholder="Enter full name" 
                          value={formData.full_name}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-white"><Mail size={18} className="text-muted" /></span>
                        <Form.Control 
                          type="email" 
                          name="email" 
                          placeholder="voter@example.com" 
                          value={formData.email}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-white"><Phone size={18} className="text-muted" /></span>
                        <Form.Control 
                          type="tel" 
                          name="phone" 
                          placeholder="+1234567890" 
                          value={formData.phone}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      <Form.Text className="text-muted small">
                        Must include country code (e.g., +1 for USA).
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted">Blockchain Public Key (Auto-generated)</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-white"><Key size={18} className="text-muted" /></span>
                        <Form.Control 
                          type="text" 
                          name="public_key" 
                          value={formData.public_key} 
                          readOnly 
                          className="bg-light font-monospace small"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 py-3 fw-bold shadow-sm" disabled={loading}>
                  {loading ? 'Registering...' : 'Complete Initialization'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="mt-4 text-center">
            <Badge bg="info" className="p-2 px-3 rounded-pill text-dark">
              <ShieldCheck size={14} className="me-1" /> Multi-layer encryption enabled
            </Badge>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddVoter;
