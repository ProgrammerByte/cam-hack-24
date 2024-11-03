import { useEffect, useRef } from "react";
import gunshotSound from "/gunshot.mp3";
import useTone from "../../hooks/useTone";
import useCheckEvents from "../../hooks/useCheckEvents";

const ActivePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const gunshotAudio = new Audio(gunshotSound);
  useCheckEvents();

  const playTone = useTone();

  const playBlip = () => {
    playTone(18000, 300);
  };

  const playGunshotSound = () => {
    gunshotAudio.currentTime = 0; // Reset to start in case it was already playing
    gunshotAudio.play();
  };

  useEffect(() => {
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
    // Function to initialize the camera
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

  function rgb2hsv(r, g, b) {
    // let s, percentRoundFn;
    let rabs, gabs, babs, rr, gg, bb, h, v, diff, diffc;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    (v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
    diffc = (c) => (v - c) / 6 / diff + 1 / 2;
    // percentRoundFn = (num) => Math.round(num * 100) / 100;
    if (diff == 0) {
      h = 0;
      // s = 0;
    } else {
      // s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
        h = bb - gg;
      } else if (gabs === v) {
        h = 1 / 3 + rr - bb;
      } else if (babs === v) {
        h = 2 / 3 + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    const nh = Math.round(h * 360);
    // const ns = percentRoundFn(s * 100);
    // const nv = percentRoundFn(v * 100);
    return nh;
  }

  const getHs = (canvas) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(
      canvas.width / 2 - 5,
      canvas.height / 2 - 5,
      10,
      10
    ); // Get a 10x10 area from the center
    const data = imageData.data;

    let r = 0,
      g = 0,
      b = 0;

    // Loop through each pixel in the area
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]; // Red
      g += data[i + 1]; // Green
      b += data[i + 2]; // Blue
    }

    // Calculate average color
    const pixelCount = data.length / 4; // Each pixel has 4 values (RGBA)
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    return rgb2hsv(r, g, b);
  };

  // Function to capture frame and convert to cv.Mat
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Camera or canvas is not ready");
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const hs = getHs(canvas);

    if (hs >= 30 && hs <= 60) {
      // collision
    }

    console.log(hs);
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
        src="/crosshair.svg"
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
          playBlip();
          captureFrame();
        }}
        className="absolute bottom-0 bg-blue-500 text-white rounded-lg px-4 py-2"
      >
        SHOOT
      </button>
    </div>
  );
};
export default ActivePage;
