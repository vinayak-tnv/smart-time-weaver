
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Calendar as CalendarIcon, ClipboardList, Bell, Settings, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/utils/dateUtils';

interface HeaderProps {
  onAddTaskClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTaskClick }) => {
  const [searchActive, setSearchActive] = useState(false);
  const today = new Date();

  const navItems = [
    { icon: CalendarIcon, label: 'Schedule', active: true },
    { icon: ClipboardList, label: 'Tasks', active: false },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <header className="sticky top-0 z-10 w-full px-6 py-4 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="text-primary"
            >
              <Calendar size={28} strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-xl font-medium">AI Scheduler</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors", 
                  item.active 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </motion.button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              "overflow-hidden transition-all duration-300 flex items-center bg-background rounded-lg border",
              searchActive ? "w-64" : "w-10"
            )}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 shrink-0" 
                onClick={() => setSearchActive(!searchActive)}
              >
                <Search className="h-4 w-4" />
              </Button>
              
              {searchActive && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  className="flex-1"
                >
                  <Input 
                    className="border-0 focus-visible:ring-0 h-10" 
                    placeholder="Search tasks..." 
                    autoFocus
                  />
                </motion.div>
              )}
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={onAddTaskClick}
                className="flex items-center bg-primary text-primary-foreground hover:opacity-90 rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold"
          >
            {formatDate(today, 'EEEE, MMMM d')}
          </motion.div>
          <div className="ml-3 px-2 py-1 bg-secondary rounded-md text-xs font-medium">
            Today
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
