import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, List, CheckCircle, Clock, Trash2, ArrowLeft } from 'lucide-react';
import { adminService } from '../services/api';

const ElectionControl = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [{ name: '', party: '', image: '' }]
  });

  const fetchElections = async () => {
    setLoading(true);
    try {
      const res = await adminService.getElections();
      setElections(res.data);
    } catch {
      setError('Error fetching elections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleAddCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: '', party: '', image: '' }]
    });
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...formData.candidates];
    updatedCandidates[index][field] = value;
    setFormData({ ...formData, candidates: updatedCandidates });
  };

  const handleRemoveCandidate = (index) => {
    const updatedCandidates = formData.candidates.filter((_, i) => i !== index);
    setFormData({ ...formData, candidates: updatedCandidates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminService.createElection(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: [{ name: '', party: '', image: '' }]
      });
      fetchElections();
    } catch (err) {
      console.error('Election creation error:', err);
      setError(err.response?.data?.message || err.message || 'Error creating election');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateElectionStatus(id, status);
      fetchElections();
    } catch {
      setError('Error updating status');
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Button variant="link" className="text-muted p-0 text-decoration-none d-flex align-items-center" onClick={() => navigate('/admin')}>
          <ArrowLeft size={16} className="me-2" /> Back to Dashboard
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold display-6 d-flex align-items-center mb-2">
            <Calendar size={32} className="text-primary me-3" /> Election Control
          </h2>
          <p className="text-muted lead mb-0">Create and manage active elections and candidates.</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} className="d-flex align-items-center px-4 py-2 shadow-sm">
          <Plus size={18} className="me-2" /> Create New Election
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="border-0 shadow-sm p-4">
        <Card.Body>
          {loading && elections.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : elections.length > 0 ? (
            <Table responsive hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Election Title</th>
                  <th>Dates</th>
                  <th>Candidates</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.map(election => (
                  <tr key={election._id}>
                    <td>
                      <div className="fw-bold">{election.title}</div>
                      <small className="text-muted">{election.description}</small>
                    </td>
                    <td>
                      <div className="small">Start: {new Date(election.startDate).toLocaleDateString()}</div>
                      <div className="small">End: {new Date(election.endDate).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <Badge bg="info" pill>{election.candidates.length} Candidates</Badge>
                    </td>
                    <td>
                      {election.status === 'active' ? (
                        <Badge bg="success" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          <CheckCircle size={14} className="me-1" /> Active
                        </Badge>
                      ) : election.status === 'upcoming' ? (
                        <Badge bg="warning" text="dark" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          <Clock size={14} className="me-1" /> Upcoming
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          Completed
                        </Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {election.status === 'upcoming' && (
                          <Button variant="outline-success" size="sm" onClick={() => updateStatus(election._id, 'active')}>Start</Button>
                        )}
                        {election.status === 'active' && (
                          <Button variant="outline-danger" size="sm" onClick={() => updateStatus(election._id, 'completed')}>End</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No elections created yet.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create Election Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Setup New Election</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Election Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. Presidential Election 2026" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={2} 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Start Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">End Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required 
                  />
                </Form.Group>
              </Col>

              <hr className="my-4" />
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Candidates</h6>
                <Button variant="outline-primary" size="sm" onClick={handleAddCandidate}>
                  <Plus size={16} className="me-1" /> Add Candidate
                </Button>
              </div>

              {formData.candidates.map((candidate, index) => (
                <div key={index} className="bg-light p-3 rounded-3 mb-3 position-relative">
                  {formData.candidates.length > 1 && (
                    <Button 
                      variant="link" 
                      className="text-danger position-absolute top-0 end-0 p-2"
                      onClick={() => handleRemoveCandidate(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Control 
                        type="text" 
                        placeholder="Full Name" 
                        value={candidate.name}
                        onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control 
                        type="text" 
                        placeholder="Party Name" 
                        value={candidate.party}
                        onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <Form.Control 
                        type="text" 
                        placeholder="Image URL (optional)" 
                        value={candidate.image}
                        onChange={(e) => handleCandidateChange(index, 'image', e.target.value)}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Row>

            <div className="d-grid mt-4">
              <Button variant="primary" type="submit" className="py-3 fw-bold" disabled={loading}>
                {loading ? 'Creating Election...' : 'Initialize Election'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ElectionControl;
