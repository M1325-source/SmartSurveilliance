import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Shield, Users, AlertTriangle, Camera, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CrimeAlert {
  id: string;
  type: 'violence' | 'theft' | 'vandalism' | 'suspicious';
  cameraId: string;
  timestamp: Date;
  confidence: number;
  description: string;
}

interface DashboardProps {
  totalCameras: number;
  activeCameras: number;
  totalFaces: number;
  alerts: Array<{ id: string; message: string; timestamp: Date; severity: 'low' | 'medium' | 'high' }>;
  crimeAlerts?: CrimeAlert[];
}

const Dashboard: React.FC<DashboardProps> = ({ totalCameras, activeCameras, totalFaces, alerts, crimeAlerts = [] }) => {
  const [uptime, setUptime] = useState(0);
  const [isAlarmMuted, setIsAlarmMuted] = useState(false);
  const [activeCrimeAlerts, setActiveCrimeAlerts] = useState<CrimeAlert[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (crimeAlerts.length > 0) {
      setActiveCrimeAlerts(crimeAlerts.slice(0, 5));
      if (!isAlarmMuted) {
        playGlobalAlarm();
      }
    }
  }, [crimeAlerts, isAlarmMuted]);

  const playGlobalAlarm = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.6);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch (error) {
      console.error('Global alarm playback failed:', error);
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCrimeAlertColor = (type: string) => {
    switch (type) {
      case 'violence': return 'border-red-500/50 bg-red-500/10 text-red-400';
      case 'theft': return 'border-orange-500/50 bg-orange-500/10 text-orange-400';
      case 'vandalism': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
      default: return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
    }
  };

  const totalCrimeAlerts = activeCrimeAlerts.length;
  const hasActiveCrimes = totalCrimeAlerts > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Status</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500 pulse-glow" />
              <span className="text-2xl font-bold text-green-400">Online</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Uptime: {formatUptime(uptime)}</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Cameras</CardTitle>
            <Camera className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{activeCameras}/{totalCameras}</div>
            <p className="text-xs text-gray-400">{Math.round((activeCameras / totalCameras) * 100)}% operational</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Faces Detected</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{totalFaces}</div>
            <p className="text-xs text-gray-400">Across all cameras</p>
          </CardContent>
        </Card>

        <Card className={`glass-dark border-white/10 ${hasActiveCrimes ? 'border-red-500 animate-pulse' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Crime Alerts</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${hasActiveCrimes ? 'text-red-400 animate-pulse' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${hasActiveCrimes ? 'text-red-400' : 'text-gray-400'}`}>{totalCrimeAlerts}</div>
            <p className="text-xs text-gray-400">Active threats</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{alerts.length}</div>
            <p className="text-xs text-gray-400">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {hasActiveCrimes && (
        <Card className="glass-dark border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                CRIME DETECTION ALERTS
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAlarmMuted(!isAlarmMuted)}
                className="text-white hover:bg-white/10"
              >
                {isAlarmMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCrimeAlerts.map((alert) => (
              <Alert key={alert.id} className={`glass border ${getCrimeAlertColor(alert.type)}`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex justify-between items-center">
                  <div>
                    <span className="font-medium capitalize">{alert.type} detected at {alert.cameraId}</span>
                    <p className="text-sm opacity-80">{alert.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {alert.confidence}%
                    </Badge>
                    <p className="text-xs opacity-60">{alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="glass-dark border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-purple-400" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No system alerts</p>
          ) : (
            alerts.slice(0, 5).map((alert) => (
              <Alert key={alert.id} className="glass border-yellow-500/20 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="flex justify-between items-center text-white">
                  <span>{alert.message}</span>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    {alert.timestamp.toLocaleTimeString()}
                  </Badge>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;