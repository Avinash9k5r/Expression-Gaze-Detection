import React, { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";
function Express() {
  const videoHeight = 480;
  const videoWidth = 640;
  const [initializing, setInitializing] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(startVideo);
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.getUserMedia(
      {
        video: {},
      },
      (stream) => (videoRef.current.srcObject = stream),
      (err) => console.error(err)
    );
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (initializing) {
        setInitializing(false);
      }
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      console.log(detections);
    }, 1000);
  };

  return (
    <div style={{ marginTop: 100 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        height={videoHeight}
        width={videoWidth}
        onPlay={handleVideoOnPlay}
        style={{ visibility: "hidden" }}
      ></video>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Express;
