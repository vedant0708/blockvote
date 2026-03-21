import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Fingerprint, Lock, ShieldCheck, Camera, Phone, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [voterId, setVoterId] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  
  // Biometric states
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (step === 3) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.sendOtp({ voter_id: voterId });
      
      const { email, phone, otp: receivedOtp } = res.data;
      
      if (receivedOtp) {
        setDevOtp(receivedOtp);
        console.log("DEVELOPMENT OTP RECEIVED:", receivedOtp);
      }
      
      setSuccess(`OTP sent to ${email || 'email'} and ${phone || 'phone'}.`);
      setStep(2);
    } catch (err) {
      console.error("Auth Error:", err);
      const msg = err.response?.data?.message || err.message || 'Error sending OTP';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.verifyOtp({ voter_id: voterId, otp });
      
      setSuccess('OTP verified successfully. Proceed to biometric verification.');
      setStep(3);
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!template) return;
    setLoading(true);
    setError(null);
    try {
      const res = await authService.biometricLogin({ voter_id: voterId, biometric_data: template });
      const { token, voter } = res.data;
      
      const role = voter.voter_id.toLowerCase().includes('admin') ? 'admin' : 'voter';
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('voter_id', voter.voter_id);
      localStorage.setItem('full_name', voter.full_name);
      
      // Dispatch custom event to update App.jsx state
      window.dispatchEvent(new Event('auth-change'));
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        if (role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Biometric verification failed');
      setCapturedImage(null);
      startCamera();
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <div className="mb-4 text-start">
            <Button as={Link} to="/" variant="link" className="text-muted p-0 text-decoration-none d-flex align-items-center">
              <ArrowLeft size={16} className="me-2" /> Back to Home
            </Button>
          </div>

          <div className="text-center mb-4">
            <h2 className="fw-bold">Voter Authentication</h2>
            <p className="text-muted">Complete all steps to access the voting booth</p>
          </div>

          <ProgressBar now={progress} className="mb-4" style={{ height: '10px' }} />

          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
              {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

              {/* Step 1: Enter Voter ID */}
              {step === 1 && (
                <Form onSubmit={handleSendOtp}>
                  <div className="text-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                      <User size={32} className="text-primary" />
                    </div>
                    <h5>Step 1: Identity Verification</h5>
                    <p className="text-muted small">Enter your unique Voter ID to begin</p>
                  </div>
                  <Form.Group className="mb-4">
                    <Form.Label>Voter ID</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. VOTE-12345" 
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
                    {loading ? 'Processing...' : 'Send OTP'}
                  </Button>
                  <div className="text-center mt-4">
                    <p className="small text-muted mb-2">Are you an administrator?</p>
                    <Button as={Link} to="/admin/login" variant="outline-dark" size="sm" className="w-100 py-2">
                      Access Admin Portal
                    </Button>
                  </div>
                </Form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <Form onSubmit={handleVerifyOtp}>
                  <div className="text-center mb-4">
                    <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                      <Phone size={32} className="text-info" />
                    </div>
                    <h5>Step 2: OTP Verification</h5>
                    <p className="text-muted small">Enter the 6-digit code sent to your device</p>
                    {devOtp && (
                      <div className="bg-warning bg-opacity-10 p-2 rounded mb-3">
                        <span className="small fw-bold text-dark">Development OTP: </span>
                        <span className="font-monospace fw-bold text-primary fs-5">{devOtp}</span>
                      </div>
                    )}
                  </div>
                  <Form.Group className="mb-4 text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Form.Control 
                        type="text" 
                        maxLength="6"
                        className="text-center fs-3 fw-bold"
                        style={{ letterSpacing: '10px' }}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <div className="text-center mt-3">
                    <Button variant="link" size="sm" onClick={() => setStep(1)}>Change Voter ID</Button>
                  </div>
                </Form>
              )}

              {/* Step 3: Biometric Verification */}
              {step === 3 && (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                      <Fingerprint size={32} className="text-success" />
                    </div>
                    <h5>Step 3: Biometric Scan</h5>
                    <p className="text-muted small">Align your face in the center of the camera</p>
                  </div>

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
                    <Button variant="primary" className="w-100 py-2 d-flex align-items-center justify-content-center" onClick={captureImage}>
                      <Camera size={18} className="me-2" /> Capture Face
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" className="w-50 py-2" onClick={resetCapture} disabled={loading}>
                        Retake
                      </Button>
                      <Button variant="success" className="w-50 py-2 d-flex align-items-center justify-content-center" onClick={handleBiometricLogin} disabled={loading}>
                        {loading ? 'Verifying...' : <><ShieldCheck size={18} className="me-2" /> Verify & Login</>}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-muted small">
              <Lock size={14} className="me-1" /> All biometric data is hashed and encrypted. We never store raw images.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
