import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Camera, RefreshCcw, Scan, Zap, Lightbulb, Bookmark, Clock, IndianRupee, Wrench, Package, ChevronRight } from 'lucide-react';
import { useScans } from '../../mocks/lensScans';
import { type ProjectIdea } from '../../mocks/projectIdeas';
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

export default function LensScan() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [detectedComponent, setDetectedComponent] = useState('');
  const [results, setResults] = useState<ProjectIdea[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pastScans = useScans();

  const handleCapture = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setScanned(false);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setCapturedImage(base64String);
        try {
          const res = await fetch('http://localhost:8081/api/v1/valuation/second-life', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64String })
          });
          
          if (!res.ok) throw new Error("API failed");
          
          const aiData: AiResponse = await res.json();
          
          setDetectedComponent(aiData.itemName);
          
          // Map AI response to the UI's ProjectIdea format
          const idea: ProjectIdea = {
            id: 'ai-generated',
            sourceComponentType: aiData.itemName,
            title: aiData.upcycleProject.title,
            difficulty: 'Intermediate',
            estimatedTimeMins: 120,
            estimatedCost: 150,
            materials: [
              { name: aiData.itemName, owned: true },
              { name: 'Basic tools', owned: true },
              { name: 'Additional parts (see steps)', owned: false }
            ],
            noveltyTag: 'novel',
            steps: aiData.upcycleProject.steps
          };
          
          const altIdeas = aiData.alternativeUseCases.map((useCase, idx) => ({
             id: `ai-alt-${idx}`,
             sourceComponentType: aiData.itemName,
             title: useCase,
             difficulty: 'Advanced' as const,
             estimatedTimeMins: 240,
             estimatedCost: 500,
             materials: [
               { name: aiData.itemName, owned: true },
               { name: 'Advanced kit', owned: false }
             ],
             noveltyTag: 'existing' as const,
             steps: []
          }));
          
          setResults([idea, ...altIdeas]);
          
        } catch (err) {
          console.error("Lens scan failed:", err);
          // Fallback
          setDetectedComponent("NEMA 17 Stepper Motor");
          setResults([{
            id: 'mock-idea',
            sourceComponentType: "Motors & Mechanics",
            title: "DIY Automated Plant Waterer",
            difficulty: 'Intermediate',
            estimatedTimeMins: 60,
            estimatedCost: 200,
            materials: [
              { name: 'NEMA 17', owned: true },
              { name: 'Arduino UNO', owned: false }
            ],
            noveltyTag: 'novel',
            steps: []
          }]);
        } finally {
          setScanning(false);
          setScanned(true);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setScanning(false);
    }
  };

  const reset = () => {
    setScanned(false);
    setResults([]);
    setCapturedImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col gap-8">
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Camera / Scan Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative bg-neutral-900 rounded-3xl aspect-[4/3] overflow-hidden border border-border shadow-lg">
             
             {!scanned && !scanning && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                 <Camera className="w-16 h-16 text-white/50 mb-6" />
                 <h2 className="text-2xl font-black mb-2 text-center">Point Lens at any component</h2>
                 <p className="text-white/70 font-medium text-center max-w-sm mb-8">AI will identify the part and generate existing project ideas or novel remixes you can build with it.</p>
                 
                 <input 
                   type="file" 
                   accept="image/*" 
                   capture="environment" 
                   ref={fileInputRef} 
                   onChange={handleCapture}
                   className="hidden" 
                 />
                 
                 <button onClick={() => fileInputRef.current?.click()} className="bg-teal hover:bg-teal/90 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98]">
                   <Scan className="w-5 h-5" /> Tap to Scan
                 </button>
               </div>
             )}

             {scanning && (
               <div className="absolute inset-0">
                 {capturedImage ? (
                   <img src={capturedImage} className="w-full h-full object-cover opacity-60" />
                 ) : (
                   <div className="w-full h-full bg-neutral-800" />
                 )}
                 
                 {/* Scanning Overlay Grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(0,137,123,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,137,123,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
                 
                 {/* Scanning Line Animation */}
                 <motion.div 
                   initial={{ top: '0%' }}
                   animate={{ top: '100%' }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                   className="absolute left-0 right-0 h-1 bg-teal shadow-[0_0_20px_4px_rgba(0,137,123,0.8)] z-10"
                 />
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <RefreshCcw className="w-12 h-12 text-teal animate-spin mb-4 drop-shadow-md" />
                    <p className="text-white font-black text-xl tracking-wider drop-shadow-md">ANALYZING GEOMETRY...</p>
                 </div>
               </div>
             )}

             {scanned && (
               <div className="absolute inset-0">
                 {capturedImage ? (
                   <img src={capturedImage} className="w-full h-full object-cover opacity-40 blur-sm" />
                 ) : (
                   <div className="w-full h-full bg-neutral-900" />
                 )}
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center">
                    <div className="w-20 h-20 bg-green-500/20 backdrop-blur rounded-full flex items-center justify-center mb-4 border-2 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                      <Zap className="w-10 h-10 text-green-400 fill-green-400" />
                    </div>
                    <p className="text-white font-bold text-sm uppercase tracking-widest mb-1 opacity-80">Detected Component</p>
                    <h2 className="text-3xl font-black text-white mb-2">{detectedComponent}</h2>
                    <p className="text-green-400 font-bold mb-8">96% Match Confidence</p>
                    <button onClick={reset} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all">
                      <RefreshCcw className="w-4 h-4" /> Scan Another Item
                    </button>
                 </div>
               </div>
             )}
          </div>

          {/* Past Scans */}
          <div className="mt-4">
             <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Your Recent Scans</h3>
             <div className="flex gap-4 overflow-x-auto pb-2">
               {pastScans.map(scan => (
                 <button key={scan.id} className="w-40 bg-white border border-border rounded-xl p-2 text-left hover:border-teal transition-colors shrink-0 group">
                   <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-neutral-100">
                     <img src={scan.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   </div>
                   <p className="text-xs font-bold text-neutral-900 line-clamp-1">{scan.detectedComponent}</p>
                   <p className="text-[10px] text-neutral-500">{new Date(scan.scannedAt).toLocaleDateString()}</p>
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Results / Ideas Panel */}
        <div className="w-full lg:w-[450px] shrink-0">
          <AnimatePresence mode="wait">
            {!scanned ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-neutral-100 rounded-3xl border border-dashed border-neutral-300 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                <Lightbulb className="w-12 h-12 text-neutral-300 mb-4" />
                <h3 className="text-xl font-bold text-neutral-400 mb-2">Awaiting Scan</h3>
                <p className="text-sm font-medium text-neutral-400">Project ideas will appear here once Lens identifies your component.</p>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="font-bold text-neutral-900 text-lg">Build Ideas for {detectedComponent}</h3>
                   <span className="bg-teal/10 text-teal px-2 py-1 rounded text-xs font-bold">{results.length} found</span>
                 </div>
                 
                 {results.map((idea, i) => (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={idea.id} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                      
                      <div className="absolute top-4 right-4 text-neutral-300 hover:text-navy cursor-pointer transition-colors"><Bookmark className="w-5 h-5" /></div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                          idea.noveltyTag === 'existing' ? "bg-white border border-teal text-teal" : "bg-gradient-to-r from-amber-400 to-teal text-white shadow-sm"
                        )}>
                          {idea.noveltyTag === 'existing' ? "Existing Idea" : "Novel Remix ✨"}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded">{idea.difficulty}</span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-neutral-900 mb-4 group-hover:text-teal transition-colors pr-8 leading-tight">
                        <Link to={`/lens/idea/${idea.id}`}>{idea.title}</Link>
                      </h4>
                      
                      <div className="flex gap-4 mb-4 text-xs font-semibold text-neutral-600">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {idea.estimatedTimeMins}m</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> {idea.estimatedCost} est.</span>
                      </div>

                      <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 mb-4">
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Package className="w-3 h-3" /> Materials Needed</p>
                        <div className="flex flex-wrap gap-1.5">
                          {idea.materials.map((m, idx) => (
                            <span key={idx} className={cn(
                              "text-[10px] font-bold px-2 py-1 rounded border",
                              m.owned ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-neutral-600 border-border"
                            )}>
                              {m.name} {m.owned && '✓'}
                            </span>
                          ))}
                        </div>
                        {idea.materials.some(m => !m.owned) && (
                          <Link to="/marketplace" className="text-[10px] font-bold text-teal flex items-center gap-1 mt-2 hover:underline">
                            Buy missing parts on Marketplace <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                      <Link to={`/lens/idea/${idea.id}`} className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                        <Wrench className="w-4 h-4" /> View Build Steps
                      </Link>

                   </motion.div>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}