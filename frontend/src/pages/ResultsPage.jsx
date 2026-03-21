import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, ListGroup, Table, Form, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { BarChart3, Database, ShieldCheck, CheckCircle, RefreshCcw, Vote } from 'lucide-react';
import { voteService } from '../services/api';

const ResultsPage = () => {
  const location = useLocation();
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(location.state?.election_id || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await voteService.getElections();
        setElections(res.data);
        if (res.data.length > 0 && !selectedElectionId) {
          setSelectedElectionId(res.data[0]._id);
        }
      } catch {
        setError('Error fetching elections');
      }
    };
    fetchElections();
  }, [selectedElectionId]);

  const fetchResults = async () => {
    if (!selectedElectionId) return;
    setLoading(true);
    try {
      const res = await voteService.getResults(selectedElectionId);
      setResults(res.data);
      const total = res.data.reduce((sum, item) => sum + item.count, 0);
      setTotalVotes(total);
    } catch {
      setError('Error fetching results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, [selectedElectionId]);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold display-6 d-flex align-items-center mb-2">
            <BarChart3 size={32} className="text-primary me-3" /> Live Election Results
          </h2>
          <p className="text-muted lead mb-0">Verified blockchain-based counts updating in real-time.</p>
        </div>
        <div className="text-end">
          <Badge bg="success" className="px-3 py-2 rounded-pill d-flex align-items-center mb-2">
            <ShieldCheck size={16} className="me-2" /> Blockchain Verified
          </Badge>
          <div className="text-muted small d-flex align-items-center justify-content-end">
            <RefreshCcw size={14} className="me-1" /> Auto-refreshing every 30s
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm p-4 mb-5 bg-light">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <h5 className="fw-bold mb-0">Select Election:</h5>
            </Col>
            <Col md={8}>
              <Form.Select 
                value={selectedElectionId} 
                onChange={(e) => setSelectedElectionId(e.target.value)}
                className="py-2 fw-bold"
              >
                {elections.map(e => (
                  <option key={e._id} value={e._id}>{e.title} ({e.status.toUpperCase()})</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          {error && <Alert variant="danger" className="mt-3" dismissible onClose={() => setError(null)}>{error}</Alert>}
        </Card.Body>
      </Card>

      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="border-0 shadow-sm p-4 h-100 bg-primary text-white">
            <Card.Body className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle p-3 d-inline-block mb-3">
                <Vote size={32} className="text-white" />
              </div>
              <h1 className="display-4 fw-bold mb-0">{totalVotes}</h1>
              <p className="lead opacity-75 mb-0">Total Votes Cast</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <Database size={20} className="text-primary me-2" /> Candidate Standings
              </h5>
              {loading && results.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                  {results.map((candidate, index) => {
                    const percentage = totalVotes > 0 ? (candidate.count / totalVotes) * 100 : 0;
                    return (
                      <div key={candidate._id}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <span className="fw-bold h6 mb-0">{candidate._id}</span>
                            {index === 0 && <Badge bg="warning" text="dark" className="ms-2">Leader</Badge>}
                          </div>
                          <div className="text-end">
                            <span className="fw-bold me-2">{candidate.count} votes</span>
                            <span className="text-muted small">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <ProgressBar 
                          now={percentage} 
                          variant={index === 0 ? 'success' : index === 1 ? 'primary' : 'info'} 
                          style={{ height: '12px' }} 
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No votes have been cast yet for this election.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResultsPage;
