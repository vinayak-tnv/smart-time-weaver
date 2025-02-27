
import React from 'react';
import { Clock, CheckCircle, Tag, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { formatTime, formatDuration } from '@/utils/dateUtils';
import { CardHoverEffect } from './animations/Transitions';

export interface Task {
  id: string;
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number; // in minutes
  category?: string;
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
}

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onCompleteToggle?: (id: string, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick,
  onCompleteToggle 
}) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-rose-100 text-rose-800'
  };
  
  const handleCompleteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCompleteToggle) {
      onCompleteToggle(task.id, !task.completed);
    }
  };
  
  return (
    <CardHoverEffect>
      <motion.div 
        layout
        className={cn(
          "group relative p-4 rounded-xl border bg-card transition-all",
          task.completed && "opacity-60"
        )}
        onClick={onClick}
      >
        {/* Priority indicator */}
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all",
            task.priority === 'low' && "bg-green-400",
            task.priority === 'medium' && "bg-amber-400",
            task.priority === 'high' && "bg-rose-400",
          )}
        />
        
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <div className="flex items-center mb-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCompleteToggle}
                className={cn(
                  "mr-2 text-muted-foreground hover:text-primary transition-colors",
                  task.completed && "text-green-600"
                )}
              >
                <CheckCircle 
                  className={cn("h-5 w-5", task.completed ? "fill-green-600" : "fill-none")} 
                />
              </motion.button>
              
              <h3 className={cn(
                "font-medium text-lg transition-all",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center mt-2 gap-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(task.scheduledDate)}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {formatDuration(task.duration)}
              </div>
              
              {task.category && (
                <div className="flex items-center text-xs bg-secondary px-2 py-0.5 rounded-full">
                  <Tag className="h-3 w-3 mr-1" />
                  {task.category}
                </div>
              )}
              
              <div className={cn(
                "text-xs px-2 py-0.5 rounded-full", 
                priorityColors[task.priority]
              )}>
                {task.priority}
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-secondary"
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </div>
        
        <div className="absolute -bottom-px left-1 right-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </CardHoverEffect>
  );
};

export default TaskCard;
