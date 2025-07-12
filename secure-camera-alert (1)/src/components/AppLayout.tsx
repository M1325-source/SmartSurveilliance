import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Camera, BarChart3, Settings, Menu, X } from 'lucide-react';
import Dashboard from './Dashboard';
import CameraGrid from './CameraGrid';
import CrimeDetection from './CrimeDetection';

interface Camera {
  id: string;
  name: string;
  isActive: boolean;
  location: string;
}

interface Alert {
  id: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

interface CrimeAlert {
  id: string;
  type: 'violence' | 'theft' | 'vandalism' | 'suspicious';
  cameraId: string;
  timestamp: Date;
  confidence: number;
  description: string;
}

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cameras, setCameras] = useState<Camera[]>([
    { id: '1', name: 'Main Entrance', isActive: true, location: 'Building A' },
    { id: '2', name: 'Parking Lot', isActive: true, location: 'Outdoor' },
    { id: '3', name: 'Lobby', isActive: false, location: 'Building A' },
    { id: '4', name: 'Emergency Exit', isActive: true, location: 'Building B' },
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [crimeAlerts, setCrimeAlerts] = useState<CrimeAlert[]>([]);
  const [totalFaces, setTotalFaces] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeCameras = cameras.filter(c => c.isActive);
      setTotalFaces(activeCameras.length * Math.floor(Math.random() * 3));
    }, 3000);

    return () => clearInterval(interval);
  }, [cameras]);

  const handleSOSAlert = (cameraId: string) => {
    const camera = cameras.find(c => c.id === cameraId);
    if (camera) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        message: `SOS Alert triggered from ${camera.name}`,
        timestamp: new Date(),
        severity: 'high'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const handleCrimeDetected = (cameraId: string, crimeType: string) => {
    const descriptions = {
      violence: 'Physical altercation detected',
      theft: 'Suspicious grabbing motion detected',
      vandalism: 'Property damage activity detected',
      suspicious: 'Unusual behavior pattern detected'
    };
    
    const newCrimeAlert: CrimeAlert = {
      id: Date.now().toString(),
      type: crimeType as 'violence' | 'theft' | 'vandalism' | 'suspicious',
      cameraId,
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 30) + 70,
      description: descriptions[crimeType as keyof typeof descriptions] || 'Criminal activity detected'
    };
    
    setCrimeAlerts(prev => [newCrimeAlert, ...prev.slice(0, 9)]);
  };

  const handleCrimeAlert = (alert: CrimeAlert) => {
    setCrimeAlerts(prev => [alert, ...prev.slice(0, 9)]);
  };

  const activeCameras = cameras.filter(c => c.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Smart Surveillance</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {activeCameras} Active
            </Badge>
            <Badge variant="outline" className={`${crimeAlerts.length > 0 ? 'text-red-400 border-red-400 animate-pulse' : 'text-yellow-400 border-yellow-400'}`}>
              {crimeAlerts.length} Crimes
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {alerts.length} Alerts
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-md">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="cameras" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Cameras
            </TabsTrigger>
            <TabsTrigger value="crime" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Crime Detection
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard
              totalCameras={cameras.length}
              activeCameras={activeCameras}
              totalFaces={totalFaces}
              alerts={alerts}
              crimeAlerts={crimeAlerts}
            />
          </TabsContent>

          <TabsContent value="cameras" className="space-y-6">
            <CameraGrid 
              cameras={cameras} 
              onSOSAlert={handleSOSAlert}
              onCrimeDetected={handleCrimeDetected}
            />
          </TabsContent>

          <TabsContent value="crime" className="space-y-6">
            <CrimeDetection 
              isActive={true}
              onCrimeDetected={handleCrimeAlert}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p>Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AppLayout;