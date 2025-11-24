// DOSYA: app/whisper/[id]/page.tsx
"use client";

import React, { useState, use, useEffect } from "react";
import { motion } from "framer-motion";
// DÜZELTME BURADA: Relative path (../../) kullandık
import { useTheme, WhisperType } from "../../context/ThemeContext";
import Link from "next/link";
import { ArrowLeft, Star, MessageCircle, Share2, Send } from "lucide-react";

export default function WhisperDetail({ params }: { params: Promise<{ id: string }> }) {
  const { getThemeColors, whispers, toggleLike, username } = useTheme();
  const theme = getThemeColors();

  // URL'den ID'yi al
  const resolvedParams = use(params);
  const whisperId = Number(resolvedParams.id);

  const [currentWhisper, setCurrentWhisper] = useState<WhisperType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hata 2'nin çözümü: whispers artık Context'ten doğru tipte geldiği için
    // TypeScript burada 'w'nin ne olduğunu anlar.
    const found = whispers.find((w) => w.id === whisperId);
    setCurrentWhisper(found);
    setIsLoading(false);
  }, [whisperId, whispers]);

  // --- YORUM KISMI ---
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState([
    { id: 101, username: "luna_moth", content: "Kesinlikle katılıyorum, harika bir his.", time: "1h", hop: 5 },
  ]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const newComment = {
      id: Date.now(),
      username: username || "Halo Walker",
      content: replyText,
      time: "Just now",
      hop: 0
    };
    setComments([...comments, newComment]);
    setReplyText("");
  };

  if (isLoading) return <div className={`min-h-screen ${theme.bg}`} />;

  // Eğer fısıltı bulunamazsa
  if (!currentWhisper) {
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg}`}>
            <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr opacity-50 ${theme.gradient}`} />
            <h1 className="text-2xl font-serif font-bold mb-4 z-10">Whisper Lost</h1>
            <p className="text-gray-500 mb-8 z-10">Bu fısıltı rüzgara karışıp kaybolmuş...</p>
            <Link href="/feed" className="z-10 px-6 py-3 bg-[#2D3436] text-white rounded-full shadow-lg hover:scale-105 transition-all">
                Return to Stream
            </Link>
        </div>
    )
  }

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg}`}>
      
      {/* Arkaplan */}
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr opacity-50 transition-all duration-1000 ${theme.gradient}`} />

      <div className="relative z-10 max-w-2xl mx-auto pt-8 pb-20 px-4">
        
        {/* NAVİGASYON */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/feed" className="p-3 rounded-full bg-white/50 hover:bg-white transition-all shadow-sm text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-xl font-serif font-bold text-gray-800">Whisper</h2>
        </div>

        {/* --- ANA WHISPER KARTI --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[40px] p-8 shadow-lg mb-8 relative overflow-hidden"
        >
          <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-40 ${currentWhisper.color}`} />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <Link href={`/profile/${currentWhisper.username}`}>
                <div className={`w-16 h-16 rounded-full border-4 border-white shadow-md ${currentWhisper.color}`} />
            </Link>
            <div>
              <Link href={`/profile/${currentWhisper.username}`}>
                 <h3 className="text-lg font-bold text-gray-900 hover:underline decoration-dotted">@{currentWhisper.username}</h3>
              </Link>
              <p className="text-sm text-gray-500">{currentWhisper.time}</p>
            </div>
          </div>

          <p className="text-2xl font-serif font-light leading-relaxed text-gray-700 mb-6 relative z-10">
            {currentWhisper.content}
          </p>

          <div className="flex justify-between items-center text-gray-500 relative z-10 pt-6 border-t border-gray-200/50">
            <div className="flex gap-8">
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg text-gray-800">{currentWhisper.hop}</span>
                    <span className="text-[10px] uppercase tracking-widest">Hopes</span>
                </div>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={() => toggleLike(currentWhisper.id)}
                 className={`p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:scale-110 transition-all ${currentWhisper.isLiked ? theme.accent : 'hover:text-yellow-500'}`}
               >
                 <Star size={24} fill={currentWhisper.isLiked ? "currentColor" : "none"} />
               </button>
               <button className="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:scale-110 transition-all hover:text-blue-500">
                 <Share2 size={24} />
               </button>
            </div>
          </div>
        </motion.div>

        {/* --- YORUM YAZMA ALANI --- */}
        <div className="flex gap-4 mb-10 items-start bg-white/40 p-4 rounded-3xl border border-white/50">
           <div className={`w-10 h-10 rounded-full flex-shrink-0 ${theme.halo}`} />
           <div className="w-full">
             <textarea 
               value={replyText}
               onChange={(e) => setReplyText(e.target.value)}
               placeholder="Bu fısıltıya nazik bir cevap bırak..."
               className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 min-h-[60px] resize-none mt-2"
             />
             <div className="flex justify-end">
               <button 
                 onClick={handleSendReply}
                 disabled={!replyText.trim()}
                 className={`p-2 rounded-full text-white shadow-md transition-all disabled:opacity-50 ${theme.button}`}
               >
                 <Send size={20} />
               </button>
             </div>
           </div>
        </div>

        {/* --- YORUMLAR --- */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 ml-2">Whispers back</h4>
          
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/30 border border-white/60 rounded-[24px] p-5 flex gap-4"
            >
              <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white" />
              </div>
              
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-gray-800 text-sm">@{comment.username}</span>
                    <span className="text-xs text-gray-400 ml-2">{comment.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star size={12} /> {comment.hop}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}