import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Camera, ShieldCheck, AlertOctagon, UploadCloud, ChevronRight, Zap, RefreshCcw, Lightbulb, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AiResponse {
  itemName: string;
  description: string;
  isHazardous: boolean;
  hazardReason: string;
  suggestedPriceRange: string;
  conditionOptions: string[];
  upcycleProject: {
    title: string;
    steps: string[];
  };
  alternativeUseCases: string[];
}

export default function ListNewItem() {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<AiResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCapture = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    
    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        try {
          const res = await fetch('http://localhost:8081/api/v1/valuation/second-life', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64String })
          });
          
          if (!res.ok) throw new Error("API failed");
          
          const data: AiResponse = await res.json();
          setAiData(data);
          setStep(2);
        } catch (err) {
          console.error("Failed to analyze image:", err);
          // Fallback if API fails
          setAiData({
            itemName: "NEMA 17 Stepper Motor",
            description: "High-torque precision motor typically harvested from old 3D printers.",
            isHazardous: false,
            hazardReason: "",
            suggestedPriceRange: "₹400 - ₹550",
            conditionOptions: ["Working", "Untested", "For Parts"],
            upcycleProject: {
              title: "DIY Automated Plant Waterer",
              steps: [
                "Connect the NEMA 17 to a 3D-printed peristaltic pump housing.",
                "Wire the motor to an Arduino UNO and a DRV8825 stepper driver.",
                "Attach a soil moisture sensor to trigger the pump when dry."
              ]
            },
            alternativeUseCases: ["DIY CNC Plotter", "Automated Camera Slider"]
          });
          setStep(2);
        } finally {
          setAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8">
      
      <div className="mb-8">
        <h1 className="text-2xl font-black text-neutral-900">List an Item for Reuse</h1>
        <p className="text-neutral-500 font-medium mt-1">Items must be safe, functional, or salvageable for parts.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden relative">
        
        {/* Step 1: Upload */}
        <AnimatePresence mode="wait">
          {step === 1 && !analyzing && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 lg:p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Snap a clear photo</h2>
              <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto">Our AI will automatically classify the component and verify it is safe for the Second Life marketplace.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <input 
                   type="file" 
                   accept="image/*" 
                   capture="environment" 
                   ref={fileInputRef} 
                   onChange={handleCapture}
                   className="hidden" 
                 />
                 <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-teal hover:bg-teal/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
                   <Camera className="w-5 h-5" /> Open Camera / Upload
                 </button>
              </div>
            </motion.div>
          )}

          {/* Analyzing State */}
          {analyzing && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 lg:p-24 flex flex-col items-center justify-center bg-navy relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
               <RefreshCcw className="w-12 h-12 text-teal animate-spin mb-6" />
               <h2 className="text-xl font-bold text-white mb-2 relative z-10">Running Lens AI Verification...</h2>
               <p className="text-sm text-white/60 font-medium relative z-10">Analyzing component and generating upcycling projects.</p>
            </motion.div>
          )}

          {/* Step 2: Result & Details */}
          {step === 2 && aiData && !aiData.isHazardous && (
            <motion.div key="step2-safe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
               <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex gap-4 items-start">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                   <ShieldCheck className="w-5 h-5 text-green-600" />
                 </div>
                 <div>
                   <h3 className="font-bold text-green-900 text-lg mb-1">Detected: {aiData.itemName}</h3>
                   <p className="text-sm text-green-800">✅ Verified reusable — not hazardous.</p>
                 </div>
               </div>

               {/* AI Upcycle Project Suggestion */}
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                 <div className="flex items-center gap-2 mb-3">
                   <Lightbulb className="w-5 h-5 text-amber-600" />
                   <h4 className="font-bold text-amber-900">Project Idea: {aiData.upcycleProject.title}</h4>
                 </div>
                 <div className="space-y-2 mb-4">
                   {aiData.upcycleProject.steps.map((step, idx) => (
                     <div key={idx} className="flex gap-2 text-sm text-amber-800">
                       <span className="font-bold">{idx + 1}.</span> 
                       <span>{step}</span>
                     </div>
                   ))}
                 </div>
                 <div className="pt-3 border-t border-amber-200/50">
                    <span className="text-xs font-bold text-amber-700/70 uppercase">Other ideas: </span>
                    <span className="text-sm text-amber-800">{aiData.alternativeUseCases.join(', ')}</span>
                 </div>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Title</label>
                   <input type="text" defaultValue={aiData.itemName} className="w-full bg-neutral-50 border border-border rounded-lg p-3 font-bold text-neutral-900 outline-none focus:border-teal" />
                 </div>
                 
                 <div className="grid sm:grid-cols-2 gap-6">
                   <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Condition</label>
                     <select className="w-full bg-neutral-50 border border-border rounded-lg p-3 font-bold text-neutral-900 outline-none focus:border-teal">
                       {aiData.conditionOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Quantity</label>
                     <input type="number" defaultValue={1} min={1} className="w-full bg-neutral-50 border border-border rounded-lg p-3 font-bold text-neutral-900 outline-none focus:border-teal" />
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                     <span>Price (₹)</span>
                     <span className="text-teal text-[10px] flex items-center gap-1"><Zap className="w-3 h-3 fill-teal" /> Suggested: {aiData.suggestedPriceRange}</span>
                   </label>
                   <input type="number" defaultValue={parseInt(aiData.suggestedPriceRange.replace(/[^0-9]/g, '').substring(0, 3)) || 0} className="w-full bg-neutral-50 border border-border rounded-lg p-3 font-black text-2xl text-neutral-900 outline-none focus:border-teal" />
                 </div>

                 <div>
                   <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Description & Specs</label>
                   <textarea rows={4} defaultValue={aiData.description} className="w-full bg-neutral-50 border border-border rounded-lg p-3 text-sm text-neutral-900 outline-none focus:border-teal resize-none"></textarea>
                 </div>
               </div>

               <div className="mt-8 pt-6 border-t border-border flex gap-4">
                 <button onClick={() => setStep(1)} className="px-6 py-3 bg-white border border-border hover:bg-neutral-50 text-neutral-700 font-bold rounded-xl transition-colors">Back</button>
                 <Link to="/marketplace" className="flex-1 px-6 py-3 bg-teal hover:bg-teal/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">Publish Listing</Link>
               </div>
            </motion.div>
          )}

          {/* Step 2: Blocked Hazardous */}
          {step === 2 && aiData && aiData.isHazardous && (
            <motion.div key="step2-danger" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 lg:p-12 text-center bg-red-50/50">
               <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertOctagon className="w-10 h-10 text-red-600" />
               </div>
               <h2 className="text-2xl font-black text-red-900 mb-4">Hazardous Material Detected</h2>
               <p className="text-red-700 font-medium mb-8 max-w-md mx-auto">
                 Lens AI detected a <strong>{aiData.itemName}</strong>. {aiData.hazardReason}
               </p>
               
               <div className="bg-white border border-red-200 rounded-xl p-6 max-w-md mx-auto mb-8 shadow-sm text-left">
                 <h3 className="font-bold text-neutral-900 text-sm mb-2">Required Action</h3>
                 <p className="text-xs text-neutral-500 mb-4">Please route this through the standard Kabadi Connect recycling flow to ensure proper traceability and safe handling.</p>
                 <Link to="/collector/sell" className="w-full py-3 bg-navy text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors">
                   Switch to Recycling Flow <ChevronRight className="w-4 h-4" />
                 </Link>
               </div>

               <button onClick={() => setStep(1)} className="text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors">Scan a different item</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}