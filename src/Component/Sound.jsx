import React, { useRef, useState, useEffect } from "react";
import bip from "../assets/bip.mp3";

const Sound = () => {
  const audioRef = useRef(new Audio(bip)); 
  const [isMuted, setIsMuted] = useState(true); 

  const toggleMute = () => {
    if (isMuted) {
    
      audioRef.current.play().catch(e => console.error("Erreur de lecture audio", e));
      setIsMuted(false);
    } else {
      
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMuted(true);
    }
  };

  return (
    <div>
    
      <button id="sound" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
};

export default Sound;
