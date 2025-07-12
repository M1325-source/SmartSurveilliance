import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Camera, Users, Activity, Shield } from 'lucide-react';

interface CameraFeedProps {
  cameraId: string;
  name: string;
  isActive: boolean;
  onSOSAlert: (cameraId: string) => void;
  onCrimeDetected?: (cameraId: string, crimeType: string) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ cameraId, name, isActive, onSOSAlert, onCrimeDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceCount, setFaceCount] = useState(0);
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [isRecording, setIsRecording] = useState(false);
  const [crimeDetected, setCrimeDetected] = useState<string | null>(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsRecording(true);
          }
        })
        .catch(err => {
          console.error('Camera access denied:', err);
          setIsRecording(false);
        });
    }

    const interval = setInterval(() => {
      if (isActive) {
        setFaceCount(Math.floor(Math.random() * 5));
        const sentiments = ['positive', 'neutral', 'negative'] as const;
        setSentiment(sentiments[Math.floor(Math.random() * sentiments.length)]);
        
        // Crime detection simulation
        if (Math.random() < 0.05) {
          const crimeTypes = ['violence', 'theft', 'vandalism', 'suspicious'];
          const detectedCrime = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
          setCrimeDetected(detectedCrime);
          setIsAlarmActive(true);
          
          if (onCrimeDetected) {
            onCrimeDetected(cameraId, detectedCrime);
          }
          
          // Play alarm sound
          playAlarmSound();
          
          // Clear crime detection after 5 seconds
          setTimeout(() => {
            setCrimeDetected(null);
            setIsAlarmActive(false);
          }, 5000);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, cameraId, onCrimeDetected]);

  const playAlarmSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentBg = () => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20';
      case 'negative': return 'bg-red-500/20';
      default: return 'bg-yellow-500/20';
    }
  };

  const getCrimeColor = (crime: string) => {
    switch (crime) {
      case 'violence': return 'text-red-500';
      case 'theft': return 'text-orange-500';
      case 'vandalism': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <Card className={`glass-dark border-white/10 overflow-hidden group hover:border-purple-500/50 transition-all duration-300 ${isAlarmActive ? 'border-red-500 animate-pulse' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm text-white">
          <span className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-purple-400" />
            {name}
          </span>
          <div className="flex items-center gap-2">
            {crimeDetected && (
              <Badge className="bg-red-500 text-white animate-pulse">
                <Shield className="w-3 h-3 mr-1" />
                CRIME DETECTED
              </Badge>
            )}
            <Badge variant={isRecording ? 'default' : 'secondary'} className={isRecording ? 'bg-red-500 text-white pulse-glow' : ''}>
              {isRecording ? 'LIVE' : 'OFFLINE'}
            </Badge>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onSOSAlert(cameraId)}
              className="h-6 px-2 bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="w-3 h-3" />
              SOS
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`relative aspect-video bg-black/50 rounded-lg overflow-hidden video-feed ${isAlarmActive ? 'ring-2 ring-red-500' : ''}`}>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Camera Offline</p>
              </div>
            </div>
          )}
          {isRecording && (
            <div className="absolute top-2 right-2">
              <Activity className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
          )}
          {crimeDetected && (
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
              <div className="text-center text-white">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className={`font-bold uppercase ${getCrimeColor(crimeDetected)}`}>{crimeDetected} DETECTED</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4 text-blue-400" />
            <span>{faceCount} faces</span>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${getSentimentBg()}`}>
            <div className={`w-2 h-2 rounded-full ${getSentimentColor().replace('text-', 'bg-')}`} />
            <span className={`capitalize text-xs ${getSentimentColor()}`}>{sentiment}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;