
// import React, { useRef, useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import "../styles/livefeed.css";

// function LiveFeed() {
//   const [scanning, setScanning] = useState(false);
//   const videoRef = useRef(null);
//   const mediaStream = useRef(null);
//   const intervalId = useRef(null);

//   // Function to capture and send frames to backend
//   const captureFrame = useCallback(async () => {
//     if (!videoRef.current) return;

//     const canvas = document.createElement("canvas");
//     canvas.width = videoRef.current.videoWidth || 640;
//     canvas.height = videoRef.current.videoHeight || 480;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     const imageData = canvas.toDataURL("image/jpeg");

//     try {
//       await axios.post("http://localhost:5000/stream", { image: imageData });
//     } catch (error) {
//       console.error("Error streaming frame:", error);
//     }
//   }, []);

//   // Function to start the camera and real-time processing
//   const startStreaming = useCallback(async () => {
//     try {
//       mediaStream.current = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream.current;
//       }
//       intervalId.current = setInterval(captureFrame, 100); // Capture frame every 100ms

//       await axios.post("http://localhost:5000/start_recording"); // Start video recording
//     } catch (err) {
//       console.error("Camera access error:", err);
//     }
//   }, [captureFrame]);

//   // Function to stop streaming and save video
//   const stopStreaming = useCallback(async () => {
//     if (mediaStream.current) {
//       mediaStream.current.getTracks().forEach(track => track.stop());
//       mediaStream.current = null;
//     }
//     clearInterval(intervalId.current);

//     try {
//       await axios.post("http://localhost:5000/stop_recording"); // Stop recording & save video
//     } catch (error) {
//       console.error("Error stopping recording:", error);
//     }
//   }, []);

//   // Handle scanning state change
//   useEffect(() => {
//     if (scanning) {
//       startStreaming();
//     } else {
//       stopStreaming();
//     }
//     return () => stopStreaming();
//   }, [scanning, startStreaming, stopStreaming]);

//   return (
//     <div className="live-feed-container">
//       <h4 className="live-feed-title">Live Scanning</h4>
//       <div className="live-feed-box">
//         {scanning ? (
//           <video ref={videoRef} autoPlay playsInline muted className="live-feed-media" />
//         ) : (
//           <div className="live-feed-placeholder">📷 Live feed will appear here</div>
//         )}
//       </div>
//       <button onClick={() => setScanning(!scanning)} className="live-feed-btn">
//         {scanning ? "Stop Scan" : "Start Scan"}
//       </button>
//     </div>
//   );
// }

// export default LiveFeed;


import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/livefeed.css";

function LiveFeed() {
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const mediaStream = useRef(null);
  const intervalId = useRef(null);

  // Function to capture and send frames to backend
  const captureFrame = useCallback(async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    try {
      await axios.post("http://localhost:5000/stream", { image: imageData });
    } catch (error) {
      console.error("Error streaming frame:", error);
    }
  }, []);

  // Function to start the camera and real-time processing
  const startStreaming = useCallback(async () => {
    try {
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream.current;
      }
      intervalId.current = setInterval(captureFrame, 100); // Capture frame every 100ms

      await axios.post("http://localhost:5000/start_recording"); // Start video recording
    } catch (err) {
      console.error("Camera access error:", err);
    }
  }, [captureFrame]);

  // Function to stop streaming and save video
  const stopStreaming = useCallback(async () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    clearInterval(intervalId.current);

    try {
      await axios.post("http://localhost:5000/stop_recording"); // Stop recording & save video
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }, []);

  // Handle scanning state change
  useEffect(() => {
    if (scanning) {
      startStreaming();
    } else {
      stopStreaming();
    }
    return () => stopStreaming();
  }, [scanning, startStreaming, stopStreaming]);

  return (
    <div className="live-feed-container">
      <h4 className="live-feed-title">Live Scanning</h4>
      <div className="live-feed-box">
        {scanning ? (
          <video ref={videoRef} autoPlay playsInline muted className="live-feed-media" />
        ) : (
          <div className="live-feed-placeholder">📷 Live feed will appear here</div>
        )}
        <div className="moving-line"></div>
      </div>
      <div className="live-feed-buttons">
        <button onClick={() => setScanning(!scanning)} className="live-feed-btn">
          {scanning ? "Stop Scan" : "Start Scan"}
        </button>
      </div>
    </div>
  );
}

export default LiveFeed;  