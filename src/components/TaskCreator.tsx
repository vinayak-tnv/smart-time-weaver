
import React, { useState } from 'react';
import { X, Clock, CalendarIcon, Tag, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Task } from './TaskCard';
import { DialogClose } from '@/components/ui/dialog';
import { ScaleIn } from './animations/Transitions';

const CATEGORIES = ['Work', 'Personal', 'Health', 'Meeting', 'Learning', 'Other'];

interface TaskCreatorProps {
  selectedDate?: Date;
  suggestedTimes?: Date[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ 
  selectedDate = new Date(), 
  suggestedTimes = [],
  onAddTask 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [time, setTime] = useState('12:00');
  const [duration, setDuration] = useState(30);
  const [category, setCategory] = useState<string | undefined>();
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const isPrioritySelected = (value: 'low' | 'medium' | 'high') => priority === value;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !date) return;
    
    // Parse time string to hours and minutes
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    const newTask: Omit<Task, 'id'> = {
      title,
      description: description.trim() || undefined,
      scheduledDate,
      duration,
      category,
      priority,
      completed: false,
    };
    
    onAddTask(newTask);
  };
  
  const handleTimeSelect = (selectedTime: Date) => {
    setTime(`${selectedTime.getHours()}:${selectedTime.getMinutes() || '00'}`);
  };

  return (
    <ScaleIn className="w-full max-w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              className="text-xl font-medium border-0 border-b rounded-none px-0 h-12 focus-visible:ring-0 focus-visible:border-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Description (optional)"
              className="resize-none min-h-24 focus-visible:ring-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date, 'PPP') : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">Time</label>
              <div className="flex space-x-2">
                <Input
                  type="time"
                  className="flex-1"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0" align="end">
                    <div className="p-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Quick select</h4>
                        <div className="flex flex-wrap gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs" 
                            onClick={() => setTime('09:00')}
                          >
                            9:00 AM
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs" 
                            onClick={() => setTime('12:00')}
                          >
                            12:00 PM
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs" 
                            onClick={() => setTime('15:00')}
                          >
                            3:00 PM
                          </Button>
                        </div>
                      </div>
                      
                      {suggestedTimes.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center mb-1">
                            <Sparkles className="h-3 w-3 text-amber-500 mr-1" />
                            <h4 className="text-xs font-medium">AI Suggested</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {suggestedTimes.map((suggestedTime) => (
                              <Button 
                                key={suggestedTime.toISOString()}
                                variant="outline" 
                                size="sm" 
                                className="text-xs"
                                onClick={() => handleTimeSelect(suggestedTime)}
                              >
                                {formatTime(suggestedTime)}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">Duration</label>
              <div className="flex rounded-md overflow-hidden">
                <Input
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  className="flex-1 rounded-r-none"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
                <div className="bg-muted text-muted-foreground px-3 py-2 text-sm flex items-center rounded-r-md border border-l-0">
                  min
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-1">Category</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      {category || "Select category"}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="p-1">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat}
                        variant="ghost"
                        className="w-full justify-start font-normal"
                        onClick={() => {
                          setCategory(cat);
                          document.body.click(); // Close the popover
                        }}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={isPrioritySelected('low') ? 'default' : 'outline'}
                className={cn(isPrioritySelected('low') && "bg-green-600 hover:bg-green-700")}
                onClick={() => setPriority('low')}
              >
                Low
              </Button>
              <Button
                type="button"
                variant={isPrioritySelected('medium') ? 'default' : 'outline'}
                className={cn(isPrioritySelected('medium') && "bg-amber-600 hover:bg-amber-700")}
                onClick={() => setPriority('medium')}
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={isPrioritySelected('high') ? 'default' : 'outline'}
                className={cn(isPrioritySelected('high') && "bg-rose-600 hover:bg-rose-700")}
                onClick={() => setPriority('high')}
              >
                High
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              Create Task
            </Button>
          </div>
        </div>
      </form>
    </ScaleIn>
  );
};

export default TaskCreator;
