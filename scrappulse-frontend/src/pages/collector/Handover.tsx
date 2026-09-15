import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { ChevronLeft, CheckCircle, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export default function Handover() {
  const { lotId } = useParams();
  const navigate = useNavigate();

  // Mock payload for the QR code
  const handoverPayload = JSON.stringify({
    lotId: lotId || 'LOT-2026-MH-0849',
    collectorId: 'COL-8921',
    material: 'Copper Wire (Insulated)',
    weight: 25,
    timestamp: new Date().toISOString(),
    gps: { lat: 19.0760, lng: 72.8777 },
    hash: '8f4e2a1b9c8d7e6f5a4b3c2d1e0f9a8b'
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] lg:min-h-0 bg-neutral-50 lg:bg-transparent lg:py-8 lg:px-4">
      <div className="flex flex-col flex-1 lg:flex-none lg:max-w-2xl lg:mx-auto w-full lg:bg-white lg:border lg:border-border lg:rounded-3xl lg:shadow-xl lg:overflow-hidden relative bg-neutral-50 pb-20 lg:pb-0">
        
        {/* Header */}
        <div className="bg-white px-4 py-3 lg:p-6 border-b border-border sticky top-0 z-30 shadow-sm flex items-center justify-between">
          <button onClick={() => navigate('/collector')} className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 bg-neutral-100 lg:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-neutral-900 lg:text-lg">Digital Handover</span>
          <button className="text-neutral-400 hover:text-neutral-900"><Download className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-neutral-900">Show this QR to Recycler</h2>
            <p className="text-sm font-medium text-neutral-500 mt-2">This serves as your E-Waste Rules 2022 digital receipt.</p>
          </div>

          <div className="bg-white border-2 border-dashed border-teal rounded-3xl p-8 flex flex-col items-center justify-center shadow-inner">
            <div className="bg-white p-4 rounded-xl shadow-md border border-neutral-100 mb-6">
              <QRCode value={handoverPayload} size={200} level="H" />
            </div>
            <div className="flex items-center gap-2 text-teal font-bold bg-teal/10 px-4 py-2 rounded-full">
              <ShieldCheck className="w-5 h-5" />
              <span>Encrypted & Verified</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-blue-200/50 pb-3">
              <span className="text-sm font-bold text-blue-900/60 uppercase tracking-wider">Lot ID</span>
              <span className="text-sm font-black text-blue-900">{lotId || 'LOT-2026-MH-0849'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-blue-200/50 pb-3">
              <span className="text-sm font-bold text-blue-900/60 uppercase tracking-wider">Expected Value</span>
              <span className="text-sm font-black text-blue-900">₹4,200 - ₹4,800</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-blue-900/60 uppercase tracking-wider">EPR Bonus</span>
              <span className="text-sm font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full">+ ₹120 (Pending)</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-amber-900">
              Do not hand over the material until the recycler scans this QR code and you receive an SMS confirmation.
            </p>
          </div>
        </div>

        <div className="fixed bottom-[64px] lg:sticky lg:bottom-0 left-0 right-0 lg:left-auto lg:right-auto bg-white/90 backdrop-blur-md p-4 lg:p-6 border-t border-border z-40 lg:rounded-b-3xl">
          <button onClick={() => navigate('/collector')} className="w-full bg-teal text-white font-black text-lg py-4 lg:py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all hover:bg-teal/90 hover:shadow-xl active:scale-[0.98]">
            <CheckCircle className="w-6 h-6" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
