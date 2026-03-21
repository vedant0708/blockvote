import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, InputGroup, Form, Alert } from 'react-bootstrap';
import { Users, Search, ShieldCheck, CheckCircle, Clock, Filter, ArrowLeft, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';

const ViewVoters = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVoters = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVoters();
      setVoters(res.data);
    } catch {
      setError('Error fetching voter list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const filteredVoters = voters.filter(voter => 
    voter.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.voter_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Users size={32} className="text-primary me-3" /> Voter Registry
          </h2>
          <p className="text-muted lead mb-0">Complete list of registered and approved voters.</p>
        </div>
        <div className="text-end">
          <Badge bg="primary" className="px-3 py-2 rounded-pill shadow-sm">
            Total: {voters.length} Voters
          </Badge>
        </div>
      </div>

      <Card className="border-0 shadow-sm p-4">
        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div style={{ maxWidth: '400px', width: '100%' }}>
              <InputGroup>
                <InputGroup.Text className="bg-white"><Search size={18} className="text-muted" /></InputGroup.Text>
                <Form.Control 
                  type="text" 
                  placeholder="Search by name, ID or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm" className="d-flex align-items-center">
                <Filter size={16} className="me-2" /> Filter
              </Button>
              <Button variant="light" size="sm" onClick={fetchVoters} className="d-flex align-items-center">
                <RefreshCcw size={16} className="me-2" /> Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredVoters.length > 0 ? (
            <Table responsive hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Voter ID</th>
                  <th>Full Name</th>
                  <th>Contact Info</th>
                  <th>Biometric Status</th>
                  <th>Voting Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.map(voter => (
                  <tr key={voter._id}>
                    <td><span className="font-monospace fw-bold text-primary">{voter.voter_id}</span></td>
                    <td><span className="fw-bold">{voter.full_name}</span></td>
                    <td>
                      <div className="small text-muted">{voter.email}</div>
                      <div className="small text-muted">{voter.phone}</div>
                    </td>
                    <td>
                      {voter.status === 'approved' ? (
                        <Badge bg="success" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          <ShieldCheck size={14} className="me-1" /> Approved
                        </Badge>
                      ) : (
                        <Badge bg="warning" text="dark" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          <Clock size={14} className="me-1" /> Pending
                        </Badge>
                      )}
                    </td>
                    <td>
                      {voter.has_voted ? (
                        <Badge bg="info" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          <CheckCircle size={14} className="me-1" /> Voted
                        </Badge>
                      ) : (
                        <Badge bg="light" text="dark" className="d-flex align-items-center py-2 px-3 rounded-pill border" style={{ width: 'fit-content' }}>
                          Not Voted
                        </Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <Button variant="link" size="sm" className="text-primary text-decoration-none">Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No voters found matching your search.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewVoters;
