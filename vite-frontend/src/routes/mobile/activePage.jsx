import cv, { matFromImageData } from "@techstark/opencv-js";
import { useEffect, useRef, useState } from "react";

const ActivePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [opencvReady, setOpencvReady] = useState(false);

  useEffect(() => {
    if (cv && cv.Mat) {
      setOpencvReady(true);
      console.log("OpenCV is ready");
    } else {
      console.error("OpenCV failed to load");
    }
    // Function to initialize the camera
    const startCamera = async () => {
      try {
        // Request access to the rear camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });

        // Ensure the video element exists and set its srcObject to the camera stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Function to capture frame and convert to cv.Mat
  const captureFrame = () => {
    if (!opencvReady || !videoRef.current || !canvasRef.current) {
      console.error("Camera, canvas, or OpenCV is not ready");
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw the current frame from the video onto the canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image data to cv.Mat format
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const mat = matFromImageData(imageData);

    return mat;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      {/* Ensure autoplay, playsInline, and muted are set to display the video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Ensure it's muted to prevent feedback
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />{" "}
      {/* Hidden canvas for capturing frame */}
      <button
        onClick={() => {
          const frameMat = captureFrame();
          if (frameMat) {
            console.log("Captured frame as cv.Mat:", frameMat);
            // Do something with frameMat, e.g., processing with OpenCV
            frameMat.delete(); // Don't forget to release memory after use
          }
        }}
        className="absolute bottom-0 bg-blue-500 text-white rounded-lg px-4 py-2"
      >
        SHOOT
      </button>
    </div>
  );
};
export default ActivePage;
