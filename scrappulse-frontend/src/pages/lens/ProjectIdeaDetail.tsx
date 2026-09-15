import { useParams, Link, useLocation } from 'react-router-dom';
import { useIdeas } from '../../mocks/projectIdeas';
import { usePosts } from '../../mocks/communityPosts';
import { Clock, IndianRupee, Printer, Share2, Bookmark, CheckCircle2, ShoppingCart, MessageSquare, Wrench } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ProjectIdeaDetail() {
  const { id = 'I-301' } = useParams();
  const location = useLocation();
  const ideas = useIdeas();
  const posts = usePosts();

  const idea = location.state?.idea || ideas.find(i => i.id === id) || ideas[0];
  const relatedPosts = posts.filter(p => p.linkedIdeaId === idea.id);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      
      {/* Header */}
      <div className="mb-8">
        {idea.image && (
          <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-6 shadow-lg border border-border">
            <img src={idea.image} alt={idea.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
            idea.noveltyTag === 'existing' ? "bg-teal/10 text-teal border border-teal/20" : "bg-gradient-to-r from-amber-400 to-teal text-white shadow-sm"
          )}>
            {idea.noveltyTag === 'existing' ? "Existing Idea" : "Novel Remix ✨"}
          </span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-white border border-border px-2 py-1 rounded">{idea.difficulty}</span>
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 leading-tight mb-4">{idea.title}</h1>
        
        <div className="flex items-center gap-6 text-sm font-semibold text-neutral-600">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-neutral-400" /> {idea.estimatedTimeMins} mins</span>
          <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-neutral-400" /> ₹{idea.estimatedCost} est.</span>
          
          <div className="ml-auto flex gap-3">
            <button className="p-2 text-neutral-500 hover:text-teal hover:bg-teal/10 rounded-full transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 text-neutral-500 hover:text-navy hover:bg-navy/10 rounded-full transition-colors"><Bookmark className="w-5 h-5" /></button>
            <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors hidden sm:block"><Printer className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Steps */}
        <div className="flex-1">
          <h2 className="text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2"><Wrench className="w-6 h-6 text-teal" /> Build Steps</h2>
          
          <div className="space-y-6">
            {idea.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-navy text-white font-black flex items-center justify-center shrink-0 shadow-sm">{idx + 1}</div>
                  {idx !== idea.steps.length - 1 && <div className="w-0.5 h-full bg-neutral-200"></div>}
                </div>
                <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex-1 pb-6 mb-2">
                  <p className="text-neutral-700 font-medium leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle2 className="w-6 h-6" /></div>
             <h3 className="font-bold text-green-900 mb-2">Build Complete!</h3>
             <p className="text-sm text-green-800 mb-6">Show off what you built to the Relectron community.</p>
             <Link to={`/community/new?idea=${idea.id}`} className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-colors">Post to Community</Link>
          </div>
        </div>

        {/* Sidebar: Materials & Community */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          
          {/* Materials List */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
             <div className="p-5 border-b border-border bg-neutral-50">
               <h3 className="font-bold text-neutral-900">Materials Needed</h3>
             </div>
             <div className="p-5 flex flex-col gap-3">
               {idea.materials.map((m, idx) => (
                 <div key={idx} className={cn("p-3 rounded-xl border flex flex-col gap-2", m.owned ? "bg-green-50 border-green-200" : "bg-white border-border")}>
                   <div className="flex items-start justify-between gap-2">
                     <span className="font-semibold text-sm text-neutral-900">{m.name}</span>
                     {m.owned && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />}
                   </div>
                   {!m.owned && (
                     <Link to={`/marketplace?q=${encodeURIComponent(m.name)}`} className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors self-start border border-transparent hover:border-neutral-300">
                       <ShoppingCart className="w-3 h-3" /> Buy Part
                     </Link>
                   )}
                 </div>
               ))}
             </div>
          </div>

          {/* Community Builds Rail */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
             <div className="p-5 border-b border-border bg-neutral-50">
               <h3 className="font-bold text-neutral-900 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-teal" /> Community Builds</h3>
             </div>
             <div className="p-4 flex flex-col gap-4">
               {relatedPosts.length > 0 ? (
                 relatedPosts.map(post => (
                   <Link key={post.id} to={`/community/post/${post.id}`} className="group flex gap-3">
                     <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-border"><img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                     <div className="flex-1 flex flex-col justify-center">
                       <p className="font-bold text-sm text-neutral-900 group-hover:text-teal transition-colors line-clamp-2 leading-tight mb-1">{post.title}</p>
                       <p className="text-xs text-neutral-500 font-medium">By {post.authorName}</p>
                     </div>
                   </Link>
                 ))
               ) : (
                 <p className="text-sm text-neutral-500 text-center py-4">No community builds yet for this idea. Be the first!</p>
               )}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}