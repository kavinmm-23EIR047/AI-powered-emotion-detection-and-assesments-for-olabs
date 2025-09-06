import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { EmotionData, Alert } from '../types/quiz';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to Python backend
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to emotion analysis server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from emotion analysis server');
    });

    socketRef.current.on('emotion_data', (data: EmotionData) => {
      setEmotionData(data);
    });

    socketRef.current.on('alert', (alert: Alert) => {
      setAlerts(prev => [...prev, alert]);
      // Remove alert after 5 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== alert.id));
      }, 5000);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const startAnalysis = () => {
    socketRef.current?.emit('start_analysis');
  };

  const stopAnalysis = () => {
    socketRef.current?.emit('stop_analysis');
  };

  const sendFrame = (frameData: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('frame', frameData);
    }
  };

  return {
    isConnected,
    emotionData,
    alerts,
    startAnalysis,
    stopAnalysis,
    sendFrame,
    clearAlerts: () => setAlerts([])
  };
};