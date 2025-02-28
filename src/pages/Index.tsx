
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ArrowUp, Filter, Plus, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import Header from '@/components/Header';
import Calendar from '@/components/Calendar';
import TaskCard, { Task } from '@/components/TaskCard';
import TaskCreator from '@/components/TaskCreator';
import AISuggestions from '@/components/AISuggestions';
import TaskProgressChart from '@/components/TaskProgressChart';
import WeatherWidget from '@/components/WeatherWidget';
import AIChatBot from '@/components/AIChatBot';
import { StaggerContainer, StaggerItem, PageTransition, SlideUp } from '@/components/animations/Transitions';
import { formatDate, suggestOptimalTimes, groupTasksByDay } from '@/utils/dateUtils';

// Sample data
const generateSampleTasks = (): Task[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return [
    {
      id: '1',
      title: 'Team meeting with design department',
      description: 'Discuss upcoming product redesign and timeline',
      scheduledDate: new Date(today.setHours(10, 0, 0, 0)),
      duration: 60,
      category: 'Meeting',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Complete quarterly report',
      scheduledDate: new Date(today.setHours(14, 30, 0, 0)),
      duration: 90,
      category: 'Work',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Lunch with Sarah',
      scheduledDate: new Date(today.setHours(12, 0, 0, 0)),
      duration: 60,
      category: 'Personal',
      priority: 'low',
    },
    {
      id: '4',
      title: 'Gym workout',
      scheduledDate: new Date(today.setHours(18, 0, 0, 0)),
      duration: 45,
      category: 'Health',
      priority: 'medium',
    },
    {
      id: '5',
      title: 'Review marketing materials',
      scheduledDate: new Date(tomorrow.setHours(9, 30, 0, 0)),
      duration: 45,
      category: 'Work',
      priority: 'medium',
    },
    {
      id: '6',
      title: 'Call with client',
      scheduledDate: new Date(tomorrow.setHours(15, 0, 0, 0)),
      duration: 30,
      category: 'Meeting',
      priority: 'high',
    },
  ];
};

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(generateSampleTasks());
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [taskCreatorOpen, setTaskCreatorOpen] = useState(false);
  const [suggestedTimes, setSuggestedTimes] = useState<Date[]>([]);
  
  useEffect(() => {
    // Filter tasks based on selected date and completed status
    const filtered = tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate);
      const isSameDay = 
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear();
      
      return isSameDay && (showCompleted || !task.completed);
    });
    
    // Sort tasks by time
    filtered.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
    
    setFilteredTasks(filtered);
    
    // Generate AI suggested times
    setSuggestedTimes(suggestOptimalTimes(tasks, selectedDate));
  }, [tasks, selectedDate, showCompleted]);
  
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const taskWithId = {
      ...newTask,
      id: uuidv4(),
    };
    
    setTasks(prevTasks => [...prevTasks, taskWithId]);
    setTaskCreatorOpen(false);
  };
  
  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed } : task
      )
    );
  };
  
  const handleSelectSuggestedTime = (time: Date) => {
    setTaskCreatorOpen(true);
    // The selected time will be used as the initial time in TaskCreator
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header onAddTaskClick={() => setTaskCreatorOpen(true)} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AISuggestions 
                suggestedTimes={suggestedTimes} 
                onSelectTime={handleSelectSuggestedTime} 
              />
              
              <Calendar 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                events={tasks}
              />
              
              <SlideUp className="mt-6">
                <TaskProgressChart tasks={tasks} />
              </SlideUp>
            </div>
            
            <div className="space-y-6">
              <SlideUp className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                    <h2 className="font-medium">
                      {formatDate(selectedDate, 'MMMM d')}
                    </h2>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setShowCompleted(!showCompleted)}
                    >
                      {showCompleted ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <Circle className="h-4 w-4 mr-1" />
                      )}
                      {showCompleted ? "Hide Completed" : "Show Completed"}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[60vh]">
                  <AnimatePresence>
                    {filteredTasks.length > 0 ? (
                      <StaggerContainer className="p-4 space-y-3">
                        {filteredTasks.map(task => (
                          <StaggerItem key={task.id}>
                            <TaskCard 
                              task={task} 
                              onCompleteToggle={handleTaskComplete}
                            />
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">No tasks for this day</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                          You don't have any tasks scheduled for this day.
                        </p>
                        <Button
                          onClick={() => setTaskCreatorOpen(true)}
                          className="flex items-center bg-primary text-primary-foreground hover:opacity-90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </SlideUp>

              {/* Add Weather Widget */}
              <SlideUp>
                <WeatherWidget />
              </SlideUp>
            </div>
          </div>
        </main>
        
        {/* AI Chat Bot */}
        <AIChatBot />
        
        <Dialog open={taskCreatorOpen} onOpenChange={setTaskCreatorOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskCreator 
              selectedDate={selectedDate}
              suggestedTimes={suggestedTimes}
              onAddTask={handleAddTask}
            />
          </DialogContent>
        </Dialog>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default Index;
