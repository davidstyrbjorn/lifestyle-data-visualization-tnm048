import React, { useEffect, useState } from "react";

/* Utility function for handling window size and resize */ 

function getWindowSize(): {width: number, height: number} {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowSize());
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowSize());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
  }