import { useCallback } from "react";

const useTone = () => {
  const playTone = useCallback((frequency, duration) => {
    // Create a new AudioContext
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Create an oscillator node
    const oscillator = audioContext.createOscillator();

    // Set the frequency of the oscillator
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Connect the oscillator to the output (speakers)
    oscillator.connect(audioContext.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after the specified duration
    setTimeout(() => {
      oscillator.stop();
      audioContext.close(); // Close the AudioContext after stopping
    }, duration);
  }, []);

  return playTone;
};

export default useTone;
