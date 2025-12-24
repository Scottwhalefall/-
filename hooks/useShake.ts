import { useState, useEffect, useCallback } from 'react';

// Velocity threshold to consider a shake
const SHAKE_THRESHOLD = 15;
// Time between shakes to prevent debounce
const SHAKE_TIMEOUT = 1000;

export const useShake = (onShake: () => void) => {
  const [lastShake, setLastShake] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const current = event.accelerationIncludingGravity;
    if (!current) return;

    const { x, y, z } = current;
    // Simple magnitude calculation (minus gravity roughly)
    // This is a simplified logic. For a pure "shake", checking the delta is often enough.
    // However, on mobile, we just want to know if it moved fast.
    
    // We can also use rotationRate if acceleration is noisy, but let's try accel first.
    // To properly detect shake, we usually track previous values, but for "lottery rattle",
    // raw magnitude spikes often work well enough.
    
    // Better logic: calculate delta from previous frame.
    // Storing ref to previous values would be better, but let's try a simpler approach 
    // using purely the magnitude of acceleration vector minus 1G (approx 9.8).
    
    const accX = x || 0;
    const accY = y || 0;
    const accZ = z || 0;
    
    // Calculate total acceleration vector length
    const totalAccel = Math.sqrt(accX * accX + accY * accY + accZ * accZ);
    
    // Earth gravity is ~9.8. If we are shaking, it goes significantly higher.
    if (totalAccel > SHAKE_THRESHOLD) {
      const now = Date.now();
      if (now - lastShake > SHAKE_TIMEOUT) {
        setLastShake(now);
        onShake();
      }
    }
  }, [lastShake, onShake]);

  const requestPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('devicemotion', handleMotion);
        } else {
          alert('Permission needed to shake!');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Non-iOS 13+ devices
      setPermissionGranted(true);
      window.addEventListener('devicemotion', handleMotion);
    }
  };

  useEffect(() => {
    // Cleanup
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleMotion]);

  return { requestPermission, permissionGranted };
};