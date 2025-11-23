// DOSYA: app/whisper/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";
import { ArrowLeft, Star, MessageCircle, Share2, Send, CornerDownRight } from "lucide-react";

export default function WhisperDetail({ params }: { params: { id: string } }) {
  const { getThemeColors } = useTheme();
  const theme = getThemeColors();

  // --- DUMMY DATA: ANA FISILTI ---
  const mainWhisper = {
    id: 1,
    username: "elara_sky",
    fullname: "Elara",
    time: "2 hours ago",
    content: "Bugün metroda tanımadığım biri gülümsedi, bütün günüm aydınlandı. Bazen sadece bir tebessüm, gri bir günü gökkuşağına çevirmeye yetiyor. 🌈✨",
    hop: 142,
    replies: 12,
    color: "bg-amber-100", // Bu fısıltının kendi halesi
    location: "Istanbul, Kadıköy"
  };

  // --- DUMMY DATA: YORUMLAR (FISILDAŞMALAR) ---
  const [comments, setComments] = useState([
    { id: 101, username: "luna_moth", content: "Kesinlikle! Geçen gün ben de benzer bir şey yaşadım.", time: "1h", hop: 5 },
    { id: 102, username: "solar_beam", content: "Gülümsemek bulaşıcıdır derler, ne kadar doğru.", time: "45m", hop: 12 },
  ]);

  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const newComment = {
      id: Date.now(),
      username: "you_are_light",
      content: replyText,
      time: "Just now",
      hop: 0
    };
    setComments([...comments, newComment]);
    setReplyText("");
  };

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

        {/* --- ANA WHISPER KARTI (BÜYÜK) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[40px] p-8 shadow-lg mb-8 relative overflow-hidden"
        >
          {/* Kartın arkasındaki hafif hale yansıması */}
          <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-40 ${mainWhisper.color}`} />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className={`w-16 h-16 rounded-full border-4 border-white shadow-md ${mainWhisper.color}`} />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{mainWhisper.fullname}</h3>
              <p className="text-sm text-gray-500">@{mainWhisper.username}</p>
            </div>
          </div>

          <p className="text-2xl font-serif font-light leading-relaxed text-gray-700 mb-6 relative z-10">
            {mainWhisper.content}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium tracking-wider uppercase mb-6 border-b border-gray-200/50 pb-6">
            <span>{mainWhisper.time}</span>
            <span>•</span>
            <span>{mainWhisper.location}</span>
          </div>

          {/* İstatistikler ve Butonlar */}
          <div className="flex justify-between items-center text-gray-500 relative z-10">
            <div className="flex gap-8">
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg text-gray-800">{mainWhisper.hop}</span>
                    <span className="text-[10px] uppercase tracking-widest">Hopes</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg text-gray-800">{mainWhisper.replies}</span>
                    <span className="text-[10px] uppercase tracking-widest">Whispers</span>
                </div>
            </div>

            <div className="flex gap-4">
               <button className={`p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:scale-110 transition-all hover:text-yellow-500`}>
                 <Star size={24} />
               </button>
               <button className="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:scale-110 transition-all hover:text-blue-500">
                 <Share2 size={24} />
               </button>
            </div>
          </div>
        </motion.div>

        {/* --- YORUM YAZMA ALANI (REPLY) --- */}
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

        {/* --- FISILDAŞMALAR (COMMENTS) --- */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 ml-2">Fısıldaşmalar</h4>
          
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/30 border border-white/60 rounded-[24px] p-5 flex gap-4"
            >
              <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white" />
                 <div className="h-full w-[1px] bg-gray-200/50" />
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