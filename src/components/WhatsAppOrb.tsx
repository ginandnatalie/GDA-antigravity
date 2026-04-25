import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppOrb() {
  const whatsappNumber = "27688526155";
  const message = encodeURIComponent("Hello Ginashe Digital Academy, I'd like to enquire about your programmes.");
  
  return (
    <motion.a 
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1 
      }}
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[3000] group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Dynamic Pulse Halo */}
      <div className="absolute inset-[-4px] bg-[#25D366] rounded-full opacity-20 blur-sm group-hover:opacity-40 animate-pulse transition-opacity" />
      
      {/* Cyber Glow (Matches Sovereign Cyan) */}
      <div className="absolute inset-[-8px] bg-[#00f2ff] rounded-full opacity-10 blur-xl group-hover:opacity-20 animate-pulse transition-opacity" />
      
      {/* Main Orb */}
      <motion.div 
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-15 h-15 bg-[#25D366] rounded-full shadow-[0_15px_40px_rgba(37,211,102,0.4),0_0_20px_rgba(0,242,255,0.2)] flex items-center justify-center border border-white/20"
      >
        <MessageCircle className="text-white w-8 h-8" />
        
        {/* Indicators */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-pulse" />
        </div>

        {/* Technical Tooltip */}
        <div className="absolute right-full mr-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
          <div className="bg-[#0b0e14]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-4 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <div className="font-outfit font-black text-[12px] text-white uppercase tracking-tighter">Contact Admissions</div>
              <div className="font-dm-mono text-[9px] text-[#25D366] uppercase tracking-widest mt-0.5">Secure_Line_27</div>
            </div>
            <div className="ml-auto w-1.5 h-8 bg-[#25D366]/20 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-full h-1/2 bg-[#25D366]"
               />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
}
