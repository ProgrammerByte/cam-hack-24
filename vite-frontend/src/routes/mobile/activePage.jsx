import cv, { matFromImageData } from "@techstark/opencv-js";
import { useEffect, useRef, useState } from "react";
import gunshotSound from "/src/assets/gunshot.mp3";

const ActivePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const gunshotAudio = new Audio(gunshotSound);
  const [opencvReady, setOpencvReady] = useState(false);

  const playGunshotSound = () => {
    gunshotAudio.currentTime = 0; // Reset to start in case it was already playing
    gunshotAudio.play();
  };

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
      {/* Hidden canvas for capturing frame */}
      <canvas ref={canvasRef} className="hidden" />{" "}
      {/* Crosshair SVG positioned at the center */}
      <img
        src="/src/assets/crosshair.svg"
        alt="Crosshair"
        className="absolute inset-0 m-auto w-16 h-16 pointer-events-none"
        style={{
          filter:
            "invert(82%) sepia(97%) saturate(7492%) hue-rotate(333deg) brightness(100%) contrast(102%)",
        }}
      />
      <button
        onClick={() => {
          playGunshotSound();
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
