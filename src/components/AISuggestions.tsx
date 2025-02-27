
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/dateUtils';
import { SlideUp, ScaleIn } from './animations/Transitions';

interface AISuggestionsProps {
  suggestedTimes: Date[];
  onSelectTime: (time: Date) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ 
  suggestedTimes, 
  onSelectTime 
}) => {
  if (!suggestedTimes.length) return null;
  
  return (
    <SlideUp className="mb-8">
      <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-5 border">
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
          <h3 className="font-medium text-lg">AI Suggested Times</h3>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          Based on your schedule and productivity patterns, these times might work best for your next task.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggestedTimes.map((time, index) => (
            <ScaleIn key={time.toISOString()} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  "hover:border-primary/50 hover:bg-white/50 dark:hover:bg-black/20",
                  "flex items-center justify-between"
                )}
                onClick={() => onSelectTime(time)}
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{formatTime(time)}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </ScaleIn>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          AI suggestions are based on your past scheduling patterns and calendar availability
        </div>
      </div>
    </SlideUp>
  );
};

export default AISuggestions;
