import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Scan, CheckCircle, AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, scanning, processing, success, error
  const [message, setMessage] = useState('');

  const markAttendance = async (teamId) => {
    console.log("markAttendance triggered for:", teamId);
    
    setStatus('processing');
    const params = new URLSearchParams();
    params.append("teamId", teamId);

    const url = "https://script.google.com/macros/s/AKfycbz7fKCNVpmVkFw8Nn-4gwAMQvTjhC4gZ6T6B9q5nl1U6nQ_VKUrYyhWxaQaeyqRcug-OA/exec"; 

    try {
      const response = await fetch(url, {
        method: "POST",
        body: params,
      });

      const result = await response.text();
      console.log("Google Response:", result);

      if (result === "Success") {
        setStatus('success');
        setMessage(`Team ${teamId} Marked Present!`);
      } else if (result === "Already Marked") {
        setStatus('error');
        setMessage(`Team ${teamId} was ALREADY marked.`);
      } else {
        setStatus('error');
        setMessage(`Error: ${result}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage("Network Error. Check console.");
    }
  };

  // ---------------------------------------------------------
  // 👇 UPDATED HANDLER FOR VERSION 2.x
  // ---------------------------------------------------------
  const handleScan = (detectedCodes) => {
    // In v2, the argument is an array of detected codes
    if (detectedCodes && detectedCodes.length > 0 && status === 'idle') {
      
      const rawValue = detectedCodes[0].rawValue;

      if (rawValue) {
        console.log("Scanned Value Found:", rawValue);
        setStatus('scanning'); 
        setScanResult(rawValue);
        markAttendance(rawValue);
      }
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <div className="z-10 mb-8 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
          CIRCUIT CRAFT<span className="text-white"> 2K26</span>
        </h1>
        <p className="text-slate-400 text-sm uppercase tracking-widest flex items-center justify-center gap-2">
          <Zap size={14} className="text-yellow-400" />
          System Online // Ready to Scan
        </p>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[0_0_30px_rgba(0,243,255,0.1)] overflow-hidden">
        
        {/* Status Bar */}
        <div className={`h-1 w-full transition-all duration-500 ${
          status === 'processing' ? 'bg-yellow-400 animate-pulse' :
          status === 'success' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' :
          'bg-cyan-500'
        }`} />

        <div className="p-6 flex flex-col items-center">
          
          {/* Scanner Viewport */}
          {status === 'idle' ? (
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
              
              {/* 👇 FIXED: Changed onResult to onScan */}
              <Scanner 
                onScan={handleScan} 
                onError={(error) => console.log(error?.message)}
                scanDelay={300} 
                components={{ audio: false, finder: false }} 
                styles={{ container: { width: '100%', height: '100%' }}}
              />

              {/* Overlay Animation */}
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#00f3ff] animate-[scan_2s_infinite_linear]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Scan size={48} className="text-cyan-400/50 animate-pulse" />
              </div>
            </div>
          ) : (
            /* Result View */
            <div className="w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700">
              {status === 'processing' && <RefreshCw className="animate-spin text-yellow-400 mb-4" size={48} />}
              {status === 'success' && <CheckCircle className="text-green-500 mb-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" size={64} />}
              {status === 'error' && <AlertCircle className="text-red-500 mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" size={64} />}
              
              <h2 className="text-2xl font-bold text-white mb-1">{scanResult || "..."}</h2>
              <p className={`text-sm font-semibold uppercase ${
                status === 'success' ? 'text-green-400' : 
                status === 'error' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {message || "Processing..."}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 w-full">
            {status !== 'idle' && (
              <button 
                onClick={handleReset}
                className="w-full group relative px-6 py-3 font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all clip-path-polygon"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform" />
                  SCAN NEXT TEAM
                </span>
              </button>
            )}
            
            {status === 'idle' && (
              <p className="text-center text-xs text-slate-500 animate-pulse">
                Align QR Code within the frame
              </p>
            )}
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-[10px] text-slate-600 font-mono">
        ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} // SECURE_CONNECTION
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}