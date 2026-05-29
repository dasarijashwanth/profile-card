import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import SoundManager from '../utils/SoundManager';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  url: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, name, url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 250,
          margin: 2,
          color: {
            dark: '#ffffff', // Keep QR code patterns highly visible in white
            light: '#00000000', // transparent background to blend into glass card
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    }
  }, [isOpen, url]);

  const handleDownload = () => {
    SoundManager.playChime();
    if (!canvasRef.current) return;

    // Create a temporary canvas with a filled dark background to make it readable when downloaded as image
    const tempCanvas = document.createElement('canvas');
    const size = 300;
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext('2d');
    
    if (ctx && canvasRef.current) {
      // Draw background
      ctx.fillStyle = '#0f172a'; // solid deep slate background for contrast
      ctx.fillRect(0, 0, size, size);
      
      // Draw QR Code centered
      ctx.drawImage(canvasRef.current, 25, 25, 250, 250);

      const dataUrl = tempCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${name.replaceAll(' ', '_')}_qr.png`;
      downloadLink.click();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              SoundManager.playClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm glass-card p-6 rounded-3xl text-center z-10 flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                SoundManager.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-primary transition-colors cursor-pointer hover:bg-card-border/10 focus:outline-none"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 text-primary mt-2">
              <QrCode size={22} className="animate-pulse" />
              <h3 className="text-lg font-extrabold tracking-tight text-text-main">
                Scan & Share Profile
              </h3>
            </div>
            
            <p className="text-xs text-text-muted mb-6 max-w-[250px] mx-auto">
              People can scan this code with their smartphone camera to instantly view your link tree.
            </p>

            {/* Canvas QR Code wrapped in neon glowing box */}
            <div className="relative group p-4 bg-slate-950/40 border border-card-border/10 rounded-2xl mb-6 shadow-inner flex items-center justify-center">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-primary-glow rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
              <canvas ref={canvasRef} className="relative max-w-full block h-auto z-10" />
            </div>

            {/* Actions */}
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 cursor-pointer active:scale-98 transition-all duration-300"
            >
              <Download size={16} />
              <span>Download PNG Image</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;
