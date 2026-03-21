import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Button, Alert, Spinner } from 'react-bootstrap';
import { User, Mail, Phone, MapPin, ShieldCheck, Key, Clock, Fingerprint, CheckCircle } from 'lucide-react';
import { authService } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authService.me();
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const registrationDate = user?.created_at ? new Date(user.created_at).toLocaleString() : '';

  return (
    <Container className="py-5">
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : !user ? null : (
      <>
        <Row className="mb-5">
          <Col>
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary rounded-circle p-4 me-4 d-flex align-items-center justify-content-center text-white" style={{ width: '100px', height: '100px' }}>
                <User size={48} />
              </div>
              <div>
                <h2 className="fw-bold mb-1">{user.full_name}</h2>
                <p className="text-muted mb-2">Voter ID: {user.voter_id}</p>
                <Badge bg="success" className="px-3 py-2 rounded-pill d-flex align-items-center" style={{ width: 'fit-content' }}>
                  <ShieldCheck size={16} className="me-2" /> {user.status}
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={8}>
            <Card className="border-0 shadow-sm p-4 mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <User size={20} className="text-primary me-2" /> Personal Information
                </h5>
                <Row className="g-4">
                  <Col sm={6}>
                    <div className="mb-4">
                      <label className="text-muted small d-block mb-1">Full Name</label>
                      <span className="fw-bold">{user.full_name}</span>
                    </div>
                    <div className="mb-4">
                      <label className="text-muted small d-block mb-1">Email Address</label>
                      <span className="fw-bold d-flex align-items-center"><Mail size={16} className="me-2 text-primary" /> {user.email}</span>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-4">
                      <label className="text-muted small d-block mb-1">Phone Number</label>
                      <span className="fw-bold d-flex align-items-center"><Phone size={16} className="me-2 text-primary" /> {user.phone}</span>
                    </div>
                    <div className="mb-4">
                      <label className="text-muted small d-block mb-1">Residential Address</label>
                      <span className="fw-bold d-flex align-items-center"><MapPin size={16} className="me-2 text-primary" /> Not provided</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm p-4">
              <Card.Body>
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <Key size={20} className="text-primary me-2" /> Blockchain Identity
                </h5>
                <div className="bg-light p-3 rounded-3 mb-4 font-monospace small border">
                  <label className="text-muted d-block mb-2">Public Key (Address):</label>
                  <span className="text-break fw-bold text-primary">{user.public_key || 'Not available'}</span>
                </div>
                <p className="text-muted small mb-0">
                  <ShieldCheck size={14} className="me-1" /> This public key is used to sign your vote on the blockchain while maintaining anonymity.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm p-4 mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <Fingerprint size={20} className="text-primary me-2" /> Security Status
                </h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0 py-3 border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Phone size={18} className="text-success me-2" />
                      <span>OTP Verified</span>
                    </div>
                    <CheckCircle size={18} className="text-success" />
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 py-3 border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Fingerprint size={18} className="text-success me-2" />
                      <span>Face ID Enrolled</span>
                    </div>
                    <CheckCircle size={18} className="text-success" />
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 py-3 border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Clock size={18} className="text-primary me-2" />
                      <span>Registered On</span>
                    </div>
                    <span className="small fw-bold">{registrationDate}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            <Button variant="outline-danger" className="w-100 py-3 border-2 fw-bold">
              Report Issue with Profile
            </Button>
          </Col>
        </Row>
      </>
      )}
    </Container>
  );
};

export default Profile;
