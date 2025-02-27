
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, isSameMonth, differenceInMinutes } from 'date-fns';

export const formatDate = (date: Date, formatString: string = 'PPP'): string => {
  return format(date, formatString);
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const getWeekDays = (date: Date = new Date()): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  
  return eachDayOfInterval({ start, end });
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = differenceInMinutes(date, now);
  
  if (diffInMinutes < 0) {
    return 'past';
  }
  
  if (diffInMinutes < 60) {
    return `in ${diffInMinutes} minutes`;
  }
  
  const hours = Math.floor(diffInMinutes / 60);
  if (hours < 24) {
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `in ${days} day${days > 1 ? 's' : ''}`;
  }
  
  return formatDate(date, 'MMM d');
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isSameMonthDate = (date: Date, compareDate: Date): boolean => {
  return isSameMonth(date, compareDate);
};

export const groupTasksByDay = (tasks: any[]): Record<string, any[]> => {
  const grouped: Record<string, any[]> = {};
  
  tasks.forEach(task => {
    const dateKey = format(new Date(task.scheduledDate), 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(task);
  });
  
  return grouped;
};

export const suggestOptimalTimes = (tasks: any[], date: Date): Date[] => {
  // Mock suggestion logic - in a real app this would use AI or more complex algorithms
  const workStartHour = 9; // 9 AM
  const workEndHour = 17; // 5 PM
  const suggestions: Date[] = [];
  
  // Create 3 suggested times throughout the day
  suggestions.push(new Date(date.setHours(workStartHour, 0, 0, 0)));
  suggestions.push(new Date(date.setHours(12, 30, 0, 0)));
  suggestions.push(new Date(date.setHours(workEndHour - 2, 0, 0, 0)));
  
  // Filter out times that overlap with existing tasks
  // (Simple implementation for now)
  
  return suggestions;
};

export const getTimeBlocks = (): string[] => {
  const blocks = [];
  for (let hour = 0; hour < 24; hour++) {
    blocks.push(`${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`);
  }
  return blocks;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};
