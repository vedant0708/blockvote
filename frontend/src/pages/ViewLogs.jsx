import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, InputGroup, Form, Alert } from 'react-bootstrap';
import { Activity, Search, ShieldCheck, CheckCircle, Clock, Filter, ArrowLeft, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';

const ViewLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getLogs();
      setLogs(res.data);
    } catch {
      setError('Error fetching authentication logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.voter_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Activity size={32} className="text-primary me-3" /> Audit & Auth Logs
          </h2>
          <p className="text-muted lead mb-0">System-wide monitoring of voter authentication and security events.</p>
        </div>
        <div className="text-end">
          <Badge bg="info" className="px-3 py-2 rounded-pill shadow-sm">
            Total Logs: {logs.length}
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
                  placeholder="Search by voter ID or action..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="d-flex gap-2">
              <Button variant="light" size="sm" onClick={fetchLogs} className="d-flex align-items-center">
                <RefreshCcw size={16} className="me-2" /> Refresh Logs
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredLogs.length > 0 ? (
            <Table responsive hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Voter ID</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th className="text-end">Verification</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log._id}>
                    <td><span className="font-monospace fw-bold text-primary">{log.voter_id}</span></td>
                    <td>
                      <Badge bg="light" text="dark" className="border px-3 py-2 text-capitalize">
                        {log.action.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td>
                      {log.success ? (
                        <Badge bg="success" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          <CheckCircle size={14} className="me-1" /> Success
                        </Badge>
                      ) : (
                        <Badge bg="danger" className="d-flex align-items-center py-2 px-3 rounded-pill" style={{ width: 'fit-content' }}>
                          <AlertTriangle size={14} className="me-1" /> Failed
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div className="small text-muted d-flex align-items-center">
                        <Clock size={14} className="me-1" /> {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-end">
                      <ShieldCheck size={18} className="text-success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No audit logs found matching your search.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewLogs;
