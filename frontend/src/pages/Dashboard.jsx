import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { User, Calendar, CheckCircle, Clock, Vote, ShieldCheck, BarChart2, ArrowRight } from 'lucide-react';
import { voteService } from '../services/api';

const Dashboard = () => {
  const [voter] = useState({
    full_name: localStorage.getItem('full_name') || 'Voter',
    voter_id: localStorage.getItem('voter_id') || 'VOTE-00000',
  });
  const [activeElections, setActiveElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await voteService.getActiveElections();
        setActiveElections(res.data);
      } catch {
        setError('Could not load active elections');
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  return (
    <Container className="py-5">
      <Row className="mb-5 align-items-center">
        <Col md={8}>
          <h2 className="fw-bold d-flex align-items-center mb-1">
            Welcome, {voter.full_name} <Badge bg="success" className="ms-3 fs-6">Verified</Badge>
          </h2>
          <p className="text-muted">ID: {voter.voter_id}</p>
        </Col>
        <Col md={4} className="text-md-end">
          <Button as={Link} to="/profile" variant="outline-primary" className="d-flex align-items-center justify-content-center float-md-end">
            <User size={18} className="me-2" /> View Profile
          </Button>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        <Col md={12}>
          <Card className="border-0 shadow-sm p-4 h-100 bg-primary text-white">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <Vote size={48} className="me-3" />
                <h3 className="fw-bold mb-0">Active Elections</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="light" />
                </div>
              ) : error ? (
                <Alert variant="danger" className="bg-transparent text-white border-white border-opacity-25">{error}</Alert>
              ) : activeElections.length > 0 ? (
                <Row className="g-3">
                  {activeElections.map(election => (
                    <Col md={6} lg={4} key={election._id}>
                      <Card className="bg-white bg-opacity-10 border-white border-opacity-25 h-100">
                        <Card.Body className="d-flex flex-column">
                          <h5 className="fw-bold mb-2">{election.title}</h5>
                          <p className="small mb-3 opacity-75">{election.description}</p>
                          <div className="mt-auto">
                            <Button 
                              as={Link} 
                              to="/vote" 
                              state={{ election }} 
                              variant="light" 
                              size="sm" 
                              className="w-100 fw-bold text-primary"
                            >
                              Go to Ballot <ArrowRight size={14} className="ms-1" />
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-4 bg-white bg-opacity-10 rounded-3">
                  <p className="mb-0 opacity-75">There are no active elections at this time.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card as={Link} to="/results" className="border-0 shadow-sm p-4 h-100 text-decoration-none text-dark hover-shadow">
            <Card.Body className="text-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                <BarChart2 size={32} className="text-info" />
              </div>
              <h5 className="fw-bold">Real-time Results</h5>
              <p className="text-muted small mb-0">Track election progress and verified counts on the blockchain.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-4 h-100 text-dark hover-shadow">
            <Card.Body className="text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                <ShieldCheck size={32} className="text-warning" />
              </div>
              <h5 className="fw-bold">Security Audit</h5>
              <p className="text-muted small mb-0">Your vote is protected by SHA-256 and stored on an immutable ledger.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card as={Link} to="/help" className="border-0 shadow-sm p-4 h-100 text-decoration-none text-dark hover-shadow">
            <Card.Body className="text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                <Calendar size={32} className="text-success" />
              </div>
              <h5 className="fw-bold">Voting Rules</h5>
              <p className="text-muted small mb-0">Learn more about the voting process and requirements.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
