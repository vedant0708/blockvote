import React from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import { HelpCircle, Shield, User, Info, AlertTriangle } from 'lucide-react';

const Help = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5 text-center">
        <Col>
          <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
            <HelpCircle size={40} className="text-primary" />
          </div>
          <h2 className="fw-bold">Help & Voting Rules</h2>
          <p className="text-muted">Everything you need to know about the secure voting process</p>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        <Col md={8}>
          <h4 className="mb-4 d-flex align-items-center">
            <Info size={24} className="text-primary me-2" /> Frequently Asked Questions
          </h4>
          <Accordion defaultActiveKey="0" className="shadow-sm">
            <Accordion.Item eventKey="0">
              <Accordion.Header>How do I register to vote?</Accordion.Header>
              <Accordion.Body>
                Voter registration is currently managed by system administrators. Please contact your 
                local election office to provide your details and perform the initial biometric enrollment.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Is my vote truly anonymous?</Accordion.Header>
              <Accordion.Body>
                Yes. While we verify your identity to ensure you are eligible to vote, the link between 
                your identity and your choice is decoupled. The blockchain stores a hash of the vote 
                without direct linkage to your Voter ID in a readable format.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>What if my biometric verification fails?</Accordion.Header>
              <Accordion.Body>
                If facial recognition fails, ensure you are in a well-lit environment and facing the 
                camera directly. If issues persist, you can contact support for manual identity 
                verification or re-enrollment.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Can I change my vote after casting it?</Accordion.Header>
              <Accordion.Body>
                No. Once a vote is committed to the blockchain, it is immutable and cannot be altered 
                or deleted. This is a core security feature of the system.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm bg-dark text-white p-4 h-100">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <AlertTriangle size={20} className="text-warning me-2" /> Important Rules
              </h5>
              <ul className="list-unstyled small">
                <li className="mb-3 pb-3 border-bottom border-secondary">
                  <strong>One Vote Per Person:</strong> Any attempt to vote multiple times will be 
                  automatically flagged and blocked by the system.
                </li>
                <li className="mb-3 pb-3 border-bottom border-secondary">
                  <strong>Secure Environment:</strong> Please ensure you are voting from a private, 
                  secure device and not a public computer.
                </li>
                <li className="mb-3 pb-3 border-bottom border-secondary">
                  <strong>No Bribery:</strong> Selling or buying votes is a criminal offense and 
                  undermines the democratic process.
                </li>
                <li className="mb-0">
                  <strong>Deadline:</strong> All votes must be cast before the election window closes 
                  as indicated on your dashboard.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="py-5 bg-light rounded-4 text-center">
        <Col>
          <Shield size={48} className="text-success mb-3" />
          <h3 className="fw-bold">Security Commitment</h3>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Our system utilizes state-of-the-art SHA-256 hashing, JWT session management, and 
            distributed ledger technology to provide the highest level of security and transparency 
            available in modern digital voting.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Help;
