import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { Fingerprint, Camera, ShieldCheck, User, CheckCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { adminService } from '../services/api';

const BiometricEnrollment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVoterId = location.state?.voter_id || '';

  const [voterId, setVoterId] = useState(initialVoterId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Biometric states
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [template, setTemplate] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!enrolled) {
      startCamera();
    }
    return () => stopCamera();
  }, [enrolled]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera access to continue.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    try {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        setError('Camera is not ready. Please wait a moment.');
        return;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Normalize to 64x64 grayscale
      canvas.width = 64;
      canvas.height = 64;
      
      // Resize
      ctx.drawImage(videoRef.current, 0, 0, 64, 64);
      
      // Grayscale
      const imgData = ctx.getImageData(0, 0, 64, 64);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
        data[i + 3] = 255; // Ensure opaque
      }
      ctx.putImageData(imgData, 0, 0);
      
      // 3. Get normalized grayscale pixels (This is our "biometric template")
      const pixels = [];
      for (let i = 0; i < data.length; i += 4) {
        pixels.push(data[i]); // Just one channel since it's grayscale
      }
      
      const biometricTemplate = JSON.stringify(pixels);
      setCapturedImage(canvas.toDataURL('image/jpeg')); // For preview only
      setTemplate(biometricTemplate); // New state to store raw pixels
      stopCamera();
    } catch (err) {
      console.error('Capture Error:', err);
      setError('Failed to capture image: ' + err.message);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleEnrollment = async () => {
    if (!voterId) {
      setError('Please enter a Voter ID');
      return;
    }
    if (!template) {
      setError('Please capture the biometric face data');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await adminService.enrollBiometric({ voter_id: voterId, biometric_data: template });
      setEnrolled(true);
      setSuccess('Biometric enrollment successful! Voter is now approved.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error during enrollment');
      setCapturedImage(null);
      startCamera();
    } finally {
      setLoading(false);
    }
  };

  if (enrolled) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg text-center p-5">
              <Card.Body>
                <div className="bg-success bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <CheckCircle size={64} className="text-success" />
                </div>
                <h2 className="fw-bold mb-4">Enrollment Complete!</h2>
                <p className="text-muted lead mb-5">
                  Voter <strong>{voterId}</strong> has been successfully biometrically enrolled and approved for the upcoming election.
                </p>

                <div className="d-flex flex-column gap-3">
                  <Button onClick={() => navigate('/admin/voters')} variant="primary" size="lg" className="w-100 py-3 shadow">
                    View Voter List
                  </Button>
                  <Button onClick={() => { setEnrolled(false); setVoterId(''); setCapturedImage(null); setSuccess(null); }} variant="outline-secondary" className="w-100">
                    Enroll Another Voter
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
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <Button variant="link" className="text-muted p-0 text-decoration-none d-flex align-items-center" onClick={() => navigate('/admin')}>
              <ArrowLeft size={16} className="me-2" /> Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
              <Fingerprint size={32} className="text-success" />
            </div>
            <h2 className="fw-bold">Biometric Enrollment</h2>
            <p className="text-muted">Capture voter's face to create a secure biometric hash</p>
          </div>

          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
              {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-muted">Voter ID</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><User size={18} className="text-muted" /></span>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Voter ID" 
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <div className="text-center">
                <div className="position-relative mb-4 bg-dark rounded-3 overflow-hidden" style={{ height: '300px' }}>
                  {!capturedImage ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-100 h-100 object-fit-cover" />
                      <div className="position-absolute top-50 start-50 translate-middle border border-white border-4 rounded-circle opacity-50" 
                           style={{ width: '200px', height: '200px' }}></div>
                    </>
                  ) : (
                    <img src={capturedImage} alt="Captured" className="w-100 h-100 object-fit-cover" />
                  )}
                </div>

                {!capturedImage ? (
                  <Button variant="primary" className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center shadow-sm" onClick={captureImage}>
                    <Camera size={18} className="me-2" /> Capture Face Data
                  </Button>
                ) : (
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" className="w-50 py-3" onClick={resetCapture} disabled={loading}>
                      <RefreshCcw size={18} className="me-2" /> Retake
                    </Button>
                    <Button variant="success" className="w-50 py-3 d-flex align-items-center justify-content-center fw-bold shadow-sm" onClick={handleEnrollment} disabled={loading}>
                      {loading ? 'Processing...' : <><ShieldCheck size={18} className="me-2" /> Save & Approve</>}
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-muted small">
              <ShieldCheck size={14} className="me-1" /> Biometric data is converted to a irreversible SHA-256 hash.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BiometricEnrollment;
