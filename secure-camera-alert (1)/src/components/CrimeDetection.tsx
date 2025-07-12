import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CrimeAlert {
  id: string;
  type: 'violence' | 'theft' | 'vandalism' | 'suspicious';
  cameraId: string;
  timestamp: Date;
  confidence: number;
  description: string;
}

interface CrimeDetectionProps {
  isActive: boolean;
  onCrimeDetected: (alert: CrimeAlert) => void;
}

const CrimeDetection: React.FC<CrimeDetectionProps> = ({ isActive, onCrimeDetected }) => {
  const [alerts, setAlerts] = useState<CrimeAlert[]>([]);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const crimeTypes = ['violence', 'theft', 'vandalism', 'suspicious'] as const;
      const descriptions = {
        violence: 'Physical altercation detected',
        theft: 'Suspicious grabbing motion detected',
        vandalism: 'Property damage activity detected',
        suspicious: 'Unusual behavior pattern detected'
      };
      
      if (Math.random() < 0.1) {
        const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
        const alert: CrimeAlert = {
          id: Date.now().toString(),
          type,
          cameraId: `CAM-${Math.floor(Math.random() * 4) + 1}`,
          timestamp: new Date(),
          confidence: Math.floor(Math.random() * 30) + 70,
          description: descriptions[type]
        };
        
        setAlerts(prev => [alert, ...prev.slice(0, 4)]);
        onCrimeDetected(alert);
        
        if (!isMuted) {
          setIsAlarmActive(true);
          playAlarmSound();
          setTimeout(() => setIsAlarmActive(false), 5000);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, isMuted, onCrimeDetected]);

  const playAlarmSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'violence': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'theft': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'vandalism': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Card className="glass-dark border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Crime Detection
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            {isAlarmActive && (
              <Badge className="bg-red-500 text-white animate-pulse">
                ALARM ACTIVE
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            <Shield className="w-8 h-8 mx-auto mb-2" />
            <p>No criminal activity detected</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${isAlarmActive ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <div>
                    <p className="font-medium capitalize">{alert.type}</p>
                    <p className="text-sm opacity-80">{alert.description}</p>
                    <p className="text-xs opacity-60">
                      {alert.cameraId} • {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {alert.confidence}%
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CrimeDetection;