import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserPlus, Users, Database, ShieldCheck, Activity, BarChart2, Plus, ArrowRight, Calendar } from 'lucide-react';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVoters: 0,
    approvedVoters: 0,
    pendingVoters: 0,
    totalVotes: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const votersRes = await adminService.getVoters();
        const voters = votersRes.data;
        const electionsRes = await adminService.getElections();
        const elections = electionsRes.data;
        
        const total = voters.length;
        const approved = voters.filter(v => v.status === 'approved').length;
        setStats({
          totalVoters: total,
          approvedVoters: approved,
          pendingVoters: total - approved,
          totalVotes: voters.filter(v => v.has_voted).length,
          activeElections: elections.filter(e => e.status === 'active').length
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold display-6 mb-1">Admin Control Center</h2>
          <p className="text-muted lead mb-0">Manage voter registry, biometric enrollment, and election integrity.</p>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/admin/add-voter" variant="primary" className="d-flex align-items-center px-4 py-2 shadow-sm">
            <Plus size={18} className="me-2" /> Register New Voter
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="border-0 shadow-sm p-3 h-100 bg-primary text-white">
            <Card.Body className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle p-2 d-inline-block mb-2">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="fw-bold mb-0">{stats.totalVoters}</h3>
              <p className="small opacity-75 mb-0">Total Registered Voters</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm p-3 h-100 bg-success text-white">
            <Card.Body className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle p-2 d-inline-block mb-2">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <h3 className="fw-bold mb-0">{stats.approvedVoters}</h3>
              <p className="small opacity-75 mb-0">Biometrically Verified</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm p-3 h-100 bg-warning text-dark">
            <Card.Body className="text-center">
              <div className="bg-dark bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <Activity size={24} className="text-dark" />
              </div>
              <h3 className="fw-bold mb-0">{stats.pendingVoters}</h3>
              <p className="small opacity-75 mb-0">Pending Enrollment</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm p-3 h-100 bg-info text-white">
            <Card.Body className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle p-2 d-inline-block mb-2">
                <Calendar size={24} className="text-white" />
              </div>
              <h3 className="fw-bold mb-0">{stats.activeElections || 0}</h3>
              <p className="small opacity-75 mb-0">Active Elections</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <Database size={20} className="text-primary me-2" /> Quick Management
              </h5>
              <ListGroup variant="flush">
                <ListGroup.Item as={Link} to="/admin/voters" className="px-0 py-3 d-flex justify-content-between align-items-center text-decoration-none text-dark hover-bg-light rounded px-3">
                  <div className="d-flex align-items-center">
                    <Users size={20} className="text-muted me-3" />
                    <span>View All Voters</span>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/admin/enroll-biometric" className="px-0 py-3 d-flex justify-content-between align-items-center text-decoration-none text-dark hover-bg-light rounded px-3">
                  <div className="d-flex align-items-center">
                    <ShieldCheck size={20} className="text-muted me-3" />
                    <span>Enroll Biometrics</span>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/admin/logs" className="px-0 py-3 d-flex justify-content-between align-items-center text-decoration-none text-dark hover-bg-light rounded px-3">
                  <div className="d-flex align-items-center">
                    <Activity size={20} className="text-muted me-3" />
                    <span>Authentication Logs</span>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/admin/election-control" className="px-0 py-3 d-flex justify-content-between align-items-center text-decoration-none text-dark hover-bg-light rounded px-3">
                  <div className="d-flex align-items-center">
                    <Calendar size={20} className="text-muted me-3" />
                    <span>Election Control</span>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/results" className="px-0 py-3 d-flex justify-content-between align-items-center text-decoration-none text-dark hover-bg-light rounded px-3">
                  <div className="d-flex align-items-center">
                    <BarChart2 size={20} className="text-muted me-3" />
                    <span>Live Election Stats</span>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <Activity size={20} className="text-primary me-2" /> Recent System Logs
              </h5>
              <div className="small text-muted mb-4 d-flex align-items-center">
                <ShieldCheck size={14} className="me-1 text-success" /> All actions are cryptographically signed.
              </div>
              <ListGroup variant="flush" className="small">
                {/* Mock data for visualization */}
                <ListGroup.Item className="px-0 py-3 border-0 border-bottom">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold">Voter Created: VOTE-12345</span>
                    <span className="text-muted">2 mins ago</span>
                  </div>
                  <div className="text-muted font-monospace tiny">TXID: 0x7a8...e42</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 border-0 border-bottom">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold">Biometric Enrollment: VOTE-99881</span>
                    <span className="text-muted">15 mins ago</span>
                  </div>
                  <div className="text-muted font-monospace tiny">TXID: 0x3c2...b91</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 border-0">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold text-danger">Failed Login Attempt: VOTE-77221</span>
                    <span className="text-muted">1 hour ago</span>
                  </div>
                  <div className="text-muted font-monospace tiny">IP: 192.168.1.102</div>
                </ListGroup.Item>
              </ListGroup>
              <div className="mt-4 text-center">
                <Button as={Link} to="/admin/logs" variant="link" className="text-primary p-0">View All Detailed Logs</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
