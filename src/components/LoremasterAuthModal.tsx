import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, KeyRound, X, AlertCircle } from 'lucide-react';

interface LoremasterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoremasterAuthModal: React.FC<LoremasterAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAnswer('');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = answer.trim().toLowerCase();

    // Accepts 'nothing', '0', 'nothing!', or 'string, or nothing'
    if (
      clean === 'nothing' ||
      clean === '0' ||
      clean === 'nothing!' ||
      clean.includes('nothing')
    ) {
      setError(null);
      onSuccess();
      onClose();
    } else {
      setError("Not quite! Remember Bilbo's riddle: 'String, or nothing!'");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md bg-[#FAF3E0] border-2 border-[#8E1616] rounded-[2px] shadow-2xl overflow-hidden relative"
        >
          {/* Header Banner */}
          <div className="bg-[#6E1010] text-[#FAF5EB] px-4 py-3 flex items-center justify-between border-b-2 border-[#8E1616]">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#FFD700]" />
              <h3 className="font-cinzel font-bold text-sm sm:text-base tracking-wide text-[#FFD700]">
                LoreMaster Authentication
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#8E1616] rounded-[2px] text-[#E2D4B5] hover:text-[#FAF5EB] transition-colors cursor-pointer"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 font-serif">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#8E1616]/10 text-[#8E1616] mb-1">
                <Sparkles className="w-5 h-5 text-[#B8860B]" />
              </div>

              <h4 className="font-cinzel font-bold text-base sm:text-lg text-[#28211D]">
                What have I got in my pocketses?
              </h4>

              <p className="text-xs sm:text-sm text-[#5C4A3E] leading-relaxed italic">
                Solve Bilbo’s famous riddle to unlock the LoreMaster Mode view.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-[#8E1616]/10 border border-[#8E1616] rounded-[2px] text-xs text-[#8E1616] flex items-center gap-2 font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Answer Input */}
            <div className="space-y-1">
              <label htmlFor="loremaster-passcode" className="block text-xs font-cinzel font-bold text-[#8E1616] uppercase tracking-wider">
                Riddle Answer
              </label>
              <input
                ref={inputRef}
                id="loremaster-passcode"
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter answer (e.g. 'nothing')..."
                className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#D8C8A8] focus:border-[#8E1616] rounded-[2px] text-sm text-[#28211D] placeholder-[#9C8A79] outline-hidden transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-cinzel font-bold text-[#5C4A3E] hover:text-[#28211D] hover:bg-[#E8DCC2] rounded-[2px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-cinzel font-bold text-[#FAF5EB] bg-[#8E1616] hover:bg-[#6E1010] active:scale-95 rounded-[2px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                Unlock LoreMaster
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
