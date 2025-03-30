import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/livefeed.css";

function LiveFeed() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (showCamera && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
        });
    }
  }, [showCamera]);

  const handleOpenCamera = () => {
    if (showCamera) {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setShowCamera(false);
    } else {
      setCapturedImage(null);
      setProcessedImage(null);
      setShowCamera(true);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      setShowCamera(false);
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setShowCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!capturedImage) return;
    
    try {
      const response = await axios.post('http://localhost:5000/detect', { image: capturedImage });
      setProcessedImage(`data:image/jpeg;base64,${response.data.processed_image}`);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  return (
    <div className="live-feed-container">
      <h4 className="live-feed-title">Live Inspection Feed</h4>
      <div className="live-feed-box">
        {showCamera ? (
          <video ref={videoRef} autoPlay playsInline muted className="live-feed-media" />
        ) : processedImage ? (
          <img src={processedImage} alt="Processed" className="live-feed-media" />
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="live-feed-media" />
        ) : (
          <div className="live-feed-placeholder">📷 Live camera feed</div>
        )}
      </div>
      <div className="live-feed-buttons">
        <button onClick={handleOpenCamera} className="live-feed-btn">
          {showCamera ? 'Close Camera' : 'Open Camera'}
        </button>
        {showCamera && <button onClick={handleCaptureImage} className="live-feed-btn">Capture</button>}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleUploadImage}
        />
        <button onClick={() => fileInputRef.current.click()} className="live-feed-btn">
          Upload Image
        </button>
        {capturedImage && <button onClick={handleAnalyzeImage} className="live-feed-btn">Analyze</button>}
      </div>
    </div>
  );
}

export default LiveFeed;