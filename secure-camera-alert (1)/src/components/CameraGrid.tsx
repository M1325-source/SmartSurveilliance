import React from 'react';
import CameraFeed from './CameraFeed';

interface Camera {
  id: string;
  name: string;
  isActive: boolean;
  location: string;
}

interface CameraGridProps {
  cameras: Camera[];
  onSOSAlert: (cameraId: string) => void;
  onCrimeDetected?: (cameraId: string, crimeType: string) => void;
}

const CameraGrid: React.FC<CameraGridProps> = ({ cameras, onSOSAlert, onCrimeDetected }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cameras.map((camera) => (
        <CameraFeed
          key={camera.id}
          cameraId={camera.id}
          name={camera.name}
          isActive={camera.isActive}
          onSOSAlert={onSOSAlert}
          onCrimeDetected={onCrimeDetected}
        />
      ))}
    </div>
  );
};

export default CameraGrid;