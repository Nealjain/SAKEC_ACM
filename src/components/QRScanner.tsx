import { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        scanQRCode();
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const scanQRCode = async () => {
    if (!('BarcodeDetector' in window)) {
      // Fallback: Use manual input
      setError('QR scanning not supported. Please enter member ID manually.');
      return;
    }

    const barcodeDetector = new (window as any).BarcodeDetector({
      formats: ['qr_code']
    });

    const scan = async () => {
      if (videoRef.current && scanning) {
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            onScan(barcodes[0].rawValue);
            stopCamera();
          } else {
            requestAnimationFrame(scan);
          }
        } catch (err) {
          requestAnimationFrame(scan);
        }
      }
    };

    scan();
  };

  return (
    <div className="space-y-4">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Camera Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 border-4 border-blue-500 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-lg"></div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 text-white rounded-full">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Position QR code within the frame</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
