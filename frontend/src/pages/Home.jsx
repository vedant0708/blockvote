import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { ShieldCheck, UserCheck, Database, Fingerprint, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const startPath = token ? (role === 'admin' ? '/admin' : '/dashboard') : '/login';

  return (
    <div>
      <div
        className="py-5 text-white"
        style={{
          background: 'linear-gradient(135deg, #0b1220 0%, #121a2e 55%, #0e7490 140%)',
        }}
      >
        <Container className="py-4">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="text-uppercase small fw-bold text-white-50 mb-3" style={{ letterSpacing: '0.12em' }}>
                Secure Voting Platform
              </div>
              <h1 className="display-4 fw-bold mb-3">Secure. Immutable. Transparent.</h1>
              <p className="lead text-white-50 mb-4">
                Blockchain-backed elections with multi-layer authentication and real-time auditability — built for trust at scale.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to={startPath} variant="light" size="lg" className="px-4 fw-bold">
                  Start Voting
                </Button>
                <Button as={Link} to="/results" variant="outline-light" size="lg" className="px-4">
                  View Results
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-3 mt-4 text-white-50 small">
                <div className="d-flex align-items-center"><ShieldCheck size={16} className="me-2" /> Tamper-evident</div>
                <div className="d-flex align-items-center"><Lock size={16} className="me-2" /> Multi-factor access</div>
                <div className="d-flex align-items-center"><Database size={16} className="me-2" /> Verifiable records</div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-4 p-4 shadow-lg">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="fw-bold">Election Console</div>
                  <span className="badge text-bg-success">LIVE</span>
                </div>
                <div className="bg-dark bg-opacity-50 rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-white-50">Auth</span>
                    <span className="text-white">OTP → Biometric</span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="text-white-50">Ledger</span>
                    <span className="text-white">SHA-256 + TXID</span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="text-white-50">Audit</span>
                    <span className="text-white">Logs + Results</span>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="flex-fill bg-dark bg-opacity-50 rounded-3 p-3">
                    <div className="text-white-50 small">Integrity</div>
                    <div className="fw-bold">End-to-end</div>
                  </div>
                  <div className="flex-fill bg-dark bg-opacity-50 rounded-3 p-3">
                    <div className="text-white-50 small">Access</div>
                    <div className="fw-bold">Role-based</div>
                  </div>
                  <div className="flex-fill bg-dark bg-opacity-50 rounded-3 p-3">
                    <div className="text-white-50 small">Monitoring</div>
                    <div className="fw-bold">24/7</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="text-uppercase small fw-bold text-muted mb-2" style={{ letterSpacing: '0.12em' }}>
                Our Mission
              </div>
              <h2 className="fw-bold mb-3">Trust-first elections, built to be verifiable.</h2>
              <p className="text-muted mb-0">
                Blockvote focuses on integrity, transparency, and usability. Every critical action is authenticated, logged, and made auditable
                while keeping the voting experience simple for voters and controllable for administrators.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <ShieldCheck size={22} className="text-primary" />
                  </div>
                  <div className="fw-bold h5 mb-0">Integrity by Design</div>
                </div>
                <div className="text-muted">
                  Votes are hashed and recorded with blockchain-style transaction IDs for verifiable, tamper-evident results.
                </div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                    <Fingerprint size={22} className="text-success" />
                  </div>
                  <div className="fw-bold h5 mb-0">Best-in-Class Access</div>
                </div>
                <div className="text-muted">
                  Multi-step authentication with OTP + biometric verification reduces account takeover and impersonation risk.
                </div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                    <Zap size={22} className="text-info" />
                  </div>
                  <div className="fw-bold h5 mb-0">Auditability & Control</div>
                </div>
                <div className="text-muted">
                  Clear admin tools, election lifecycle controls, and searchable logs for governance and monitoring.
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="py-5 bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={6}>
              <h2 className="fw-bold mb-4">How it works</h2>
              <div className="d-flex align-items-start mb-4">
                <div className="bg-dark text-white rounded-circle px-3 py-2 me-3 fw-bold">1</div>
                <div>
                  <div className="fw-bold mb-1">Login & OTP</div>
                  <div className="text-muted">Enter your Voter ID and verify the one-time password.</div>
                </div>
              </div>
              <div className="d-flex align-items-start mb-4">
                <div className="bg-dark text-white rounded-circle px-3 py-2 me-3 fw-bold">2</div>
                <div>
                  <div className="fw-bold mb-1">Biometric Verification</div>
                  <div className="text-muted">Perform a quick facial verification to confirm identity.</div>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <div className="bg-dark text-white rounded-circle px-3 py-2 me-3 fw-bold">3</div>
                <div>
                  <div className="fw-bold mb-1">Cast Your Vote</div>
                  <div className="text-muted">Submit your ballot. The vote is hashed and stored with a verifiable transaction ID.</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop"
                alt="Voting"
                className="img-fluid rounded-4 shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
