
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const suggestions = [
  "What tasks do I have today?",
  "Suggest optimal time for a meeting",
  "Add a reminder for tomorrow",
  "Analyze my productivity trends",
  "Reschedule my afternoon tasks"
];

const AIChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI scheduler assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Check for "thank you" to end conversation
    if (
      inputValue.toLowerCase().includes('thank you') || 
      inputValue.toLowerCase().includes('thanks') ||
      inputValue.toLowerCase().includes('thankyou')
    ) {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "You're welcome! If you need anything else, feel free to ask. I'll close this chat for now.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        // Close the chat after a delay
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      }, 1000);
      return;
    }

    // Generate AI response
    setTimeout(() => {
      let botResponse = '';
      
      // Simple response logic based on user input
      if (inputValue.toLowerCase().includes('task') || inputValue.toLowerCase().includes('todo')) {
        botResponse = "I see you're asking about tasks. Based on your schedule, you have 3 high priority tasks today. Would you like me to show you details?";
      } else if (inputValue.toLowerCase().includes('meeting') || inputValue.toLowerCase().includes('schedule')) {
        botResponse = "Looking at your calendar, 2:30 PM or 4:00 PM would be optimal times for a new meeting today. Both slots have 30 minutes of free time before and after.";
      } else if (inputValue.toLowerCase().includes('reminder') || inputValue.toLowerCase().includes('tomorrow')) {
        botResponse = "I can help set a reminder for tomorrow. What time and what should I remind you about?";
      } else if (inputValue.toLowerCase().includes('productivity') || inputValue.toLowerCase().includes('analyze')) {
        botResponse = "Based on your patterns, you're most productive between 9AM-11AM. Would you like me to schedule high-priority tasks during this time?";
      } else {
        botResponse = "I understand you're asking about " + inputValue.split(' ').slice(0, 3).join(' ') + "... Is there a specific way I can help you with your scheduling or tasks?";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    
    // Auto send after a brief delay
    setTimeout(() => {
      handleSend();
    }, 300);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <motion.button
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Bot className="h-6 w-6" />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 w-80 md:w-96 rounded-lg overflow-hidden bg-card border shadow-lg"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground h-8 w-8 hover:bg-primary-foreground/20"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages container */}
            <div className="h-96 overflow-y-auto p-4 bg-card">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "mb-4 max-w-[80%] p-3 rounded-lg",
                      message.type === 'user' 
                        ? "ml-auto bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted p-3 rounded-lg max-w-[80%] mb-4"
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Input container */}
            <div className="p-3 border-t bg-background">
              <div className="relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="resize-none pr-10 min-h-[60px] max-h-[120px]"
                />
                <Button 
                  size="icon" 
                  className="absolute right-2 bottom-2 h-8 w-8"
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Suggestions */}
              <div className="mt-2">
                <div 
                  className="flex items-center text-xs text-muted-foreground cursor-pointer"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <span>Suggestions</span>
                  {showSuggestions ? (
                    <ChevronUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-1" />
                  )}
                </div>
                
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-x-2 space-y-2 overflow-hidden"
                    >
                      {suggestions.map((suggestion, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: idx * 0.05 }
                          }}
                          className="inline-block px-3 py-1 text-xs bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
