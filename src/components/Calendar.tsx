
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  formatDate, 
  getWeekDays, 
  isToday,
  getTimeBlocks
} from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { SlideIn } from './animations/Transitions';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  events: any[];
}

const Calendar: React.FC<CalendarProps> = ({ 
  selectedDate, 
  onDateChange, 
  events 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('day');
  
  const weekDays = getWeekDays(currentDate);
  const timeBlocks = getTimeBlocks();
  
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleDayClick = (date: Date) => {
    onDateChange(date);
    setCurrentDate(date);
  };
  
  return (
    <SlideIn className="glass-panel rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-xs font-medium transition-colors",
              viewMode === 'day' && "bg-secondary"
            )}
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-xs font-medium transition-colors",
              viewMode === 'week' && "bg-secondary"
            )}
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="p-1.5 rounded-full hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          
          <h3 className="text-sm font-medium">
            {viewMode === 'week' 
              ? `${formatDate(weekDays[0], 'MMM d')} - ${formatDate(weekDays[6], 'MMM d')}`
              : formatDate(currentDate, 'MMMM d, yyyy')
            }
          </h3>
          
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            const today = new Date();
            setCurrentDate(today);
            onDateChange(today);
          }}
        >
          Today
        </Button>
      </div>
      
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, index) => {
            const isSelectedDay = isToday(day);
            return (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "py-3 text-center flex flex-col items-center",
                  isSelectedDay && "bg-secondary"
                )}
                onClick={() => handleDayClick(day)}
              >
                <span className="text-xs text-muted-foreground">
                  {formatDate(day, 'E')}
                </span>
                <span className={cn(
                  "mt-1 flex items-center justify-center w-8 h-8 rounded-full text-sm",
                  isSelectedDay && "bg-primary text-primary-foreground font-medium"
                )}>
                  {formatDate(day, 'd')}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
      
      <div className="overflow-y-auto max-h-[500px] scrollbar-thin">
        {viewMode === 'day' ? (
          <div className="p-4 space-y-2">
            {timeBlocks.map((timeBlock, index) => (
              <div 
                key={timeBlock} 
                className={cn(
                  "flex items-center py-3 px-4 rounded-lg",
                  index % 2 === 0 ? "bg-background/50" : "bg-transparent"
                )}
              >
                <div className="w-16 text-xs text-muted-foreground">
                  {timeBlock}
                </div>
                <div className="flex-1 min-h-[40px] rounded-lg border border-dashed border-border/60 hover:border-primary/40 transition-colors">
                  {/* Event would render here */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 divide-x h-[500px] overflow-y-auto">
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-1 relative min-h-[500px] p-1">
                {timeBlocks.map((timeBlock, blockIndex) => (
                  <div 
                    key={`${dayIndex}-${blockIndex}`}
                    className={cn(
                      "w-full h-12 text-xs px-1",
                      blockIndex % 2 === 0 ? "bg-background/50" : "bg-transparent",
                    )}
                  >
                    {blockIndex === 0 && (
                      <div className="text-xs text-muted-foreground pt-1">
                        {timeBlock}
                      </div>
                    )}
                  </div>
                ))}
                {/* Events would render here positioned absolutely */}
              </div>
            ))}
          </div>
        )}
      </div>
    </SlideIn>
  );
};

export default Calendar;
