import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CheckCircle, Vote, AlertTriangle, Fingerprint, Lock, ArrowLeft } from 'lucide-react';
import { voteService } from '../services/api';

const VotePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const election = location.state?.election;

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voted, setVoted] = useState(false);
  const [voteDetails, setVoteDetails] = useState(null);
  const [receiptStatus, setReceiptStatus] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  // If no election is selected, redirect to dashboard
  useEffect(() => {
    if (!election) {
      navigate('/dashboard');
    }
  }, [election, navigate]);

  const handleVoteSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const voter_id = localStorage.getItem('voter_id');
      const res = await voteService.castVote({ 
        voter_id, 
        election_id: election._id,
        candidate: selectedCandidate.name 
      });
      setVoteDetails(res.data);
      setVoted(true);
      setShowConfirm(false);
      setReceiptStatus(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error casting vote. You may have already voted in this election.');
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReceipt = async () => {
    if (!voteDetails?.transaction_id) return;
    setReceiptLoading(true);
    setReceiptStatus(null);
    try {
      const res = await voteService.verifyReceipt(voteDetails.transaction_id);
      setReceiptStatus(res.data);
    } catch (err) {
      setReceiptStatus({ verified: false, message: err.response?.data?.message || 'Receipt verification failed' });
    } finally {
      setReceiptLoading(false);
    }
  };

  if (!election) return null;

  if (voted) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg text-center p-5">
              <Card.Body>
                <div className="bg-success bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <CheckCircle size={64} className="text-success" />
                </div>
                <h2 className="fw-bold mb-4">Vote Successfully Cast!</h2>
                <p className="text-muted lead mb-5">
                  Your vote for <strong>{selectedCandidate.name}</strong> in <strong>{election.title}</strong> has been hashed and stored on the blockchain ledger.
                </p>

                <div className="bg-light p-4 rounded-4 mb-4 text-start font-monospace small border border-secondary border-opacity-25">
                  <div className="mb-3">
                    <span className="text-muted d-block mb-1">Blockchain Transaction ID:</span>
                    <span className="text-primary d-block text-break">{voteDetails.transaction_id}</span>
                  </div>
                  <div>
                    <span className="text-muted d-block mb-1">Vote Hash (SHA-256):</span>
                    <span className="text-secondary d-block text-break">{voteDetails.vote_hash}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  <Button onClick={handleVerifyReceipt} variant="outline-success" size="lg" className="w-100 py-3" disabled={receiptLoading}>
                    {receiptLoading ? 'Verifying Receipt...' : 'Verify Receipt'}
                  </Button>
                  {receiptStatus && (
                    <Alert variant={receiptStatus.verified ? 'success' : 'danger'} className="mb-0">
                      {receiptStatus.verified ? 'Receipt verified on server.' : (receiptStatus.message || 'Receipt not verified')}
                    </Alert>
                  )}
                  <Button onClick={() => navigate('/results', { state: { election_id: election._id } })} variant="primary" size="lg" className="w-100 py-3 shadow">
                    View Election Results
                  </Button>
                  <Button onClick={() => navigate('/dashboard')} variant="outline-secondary" className="w-100">
                    Return to Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Button variant="link" className="text-muted p-0 text-decoration-none d-flex align-items-center" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} className="me-2" /> Back to Dashboard
        </Button>
      </div>

      <div className="text-center mb-5">
        <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill d-inline-flex align-items-center">
          <ShieldCheck size={16} className="me-2" /> Blockchain Secured Ballot
        </Badge>
        <h2 className="fw-bold display-6">{election.title}</h2>
        <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>
          {election.description}
        </p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Row className="g-4 mb-5 justify-content-center">
        {election.candidates.map((candidate, index) => (
          <Col md={6} lg={3} key={index}>
            <Card 
              className={`h-100 border-2 transition-all cursor-pointer shadow-sm ${selectedCandidate?.name === candidate.name ? 'border-primary' : 'border-transparent'}`}
              onClick={() => setSelectedCandidate(candidate)}
              style={{ transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
            >
              <Card.Img 
                variant="top" 
                src={candidate.image || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop'} 
                style={{ height: '220px', objectFit: 'cover' }} 
              />
              <Card.Body className="text-center">
                <Card.Title className="fw-bold mb-2">{candidate.name}</Card.Title>
                <Card.Text className="text-muted small mb-3">{candidate.party}</Card.Text>
                <div className="d-grid">
                  <Button 
                    variant={selectedCandidate?.name === candidate.name ? 'primary' : 'outline-primary'} 
                    className="py-2"
                  >
                    {selectedCandidate?.name === candidate.name ? 'Selected' : 'Select Candidate'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center">
        <Button 
          variant="success" 
          size="lg" 
          className="px-5 py-3 shadow fw-bold d-inline-flex align-items-center"
          disabled={!selectedCandidate || loading}
          onClick={() => setShowConfirm(true)}
        >
          {loading ? <Spinner size="sm" className="me-2" /> : <Vote size={24} className="me-2" />} Submit Ballot
        </Button>
        <p className="text-muted small mt-3">
          <AlertTriangle size={14} className="me-1" /> Once submitted, your vote cannot be changed.
        </p>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Confirm Your Vote</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-4">
          <p className="mb-4">You are about to cast your vote for:</p>
          <div className="bg-light p-3 rounded-3 d-flex align-items-center mb-4 border">
            <img 
              src={selectedCandidate?.image || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop'} 
              alt={selectedCandidate?.name} 
              className="rounded-circle me-3" 
              width="60" 
              height="60" 
              style={{ objectFit: 'cover' }} 
            />
            <div>
              <h5 className="fw-bold mb-0">{selectedCandidate?.name}</h5>
              <small className="text-muted">{selectedCandidate?.party}</small>
            </div>
          </div>

          <div className="bg-warning bg-opacity-10 p-3 rounded-3 mb-4">
            <p className="small text-dark mb-0 d-flex align-items-start">
              <AlertTriangle size={18} className="text-warning me-2 flex-shrink-0" />
              This action is final for the <strong>{election.title}</strong>. Your vote will be hashed and stored on the blockchain.
            </p>
          </div>

          <div className="d-flex align-items-center justify-content-center text-muted small">
            <Lock size={14} className="me-1" /> <Fingerprint size={14} className="me-1" /> Identity Verified via Biometric
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 flex-column">
          <Button variant="success" size="lg" className="w-100 mb-2 py-3 shadow" onClick={handleVoteSubmit} disabled={loading}>
            {loading ? 'Committing to Blockchain...' : 'Confirm & Cast Vote'}
          </Button>
          <Button variant="link" className="text-muted" onClick={() => setShowConfirm(false)} disabled={loading}>
            Cancel and Go Back
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VotePage;
