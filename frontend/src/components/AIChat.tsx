import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, X, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AI_RESPONSES = {
  vastu: [
    "Vastu Shastra plays a crucial role in Indian home buying decisions. A Vastu-compliant home can increase property value by 5-15%.",
    "Traditional Kerala homes like Nalukettu are designed according to Vastu principles with central courtyards and proper directional alignment.",
    "Key Vastu factors include: North-facing entrance, East-facing kitchen, Northeast corner for water features, and proper room placement."
  ],
  pricing: [
    "Our AI considers multiple factors: location, size, age, condition, and Vastu compliance for accurate pricing.",
    "Traditional homes often have higher value due to their architectural significance and Vastu compliance.",
    "The price estimation includes a Vastu premium/discount based on the property's compliance score."
  ],
  kerala: [
    "Kerala traditional homes feature unique architectural elements like sloping roofs, wooden pillars, and central courtyards.",
    "Nalukettu houses are the epitome of Kerala architecture, designed for natural ventilation and Vastu compliance.",
    "These homes often command premium prices due to their cultural significance and traditional craftsmanship."
  ],
  general: [
    "I can help you understand property valuations, Vastu considerations, and traditional home features.",
    "Ask me about specific homes, pricing factors, or architectural features you're interested in.",
    "Our platform combines modern AI technology with traditional Indian architectural wisdom."
  ]
};

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant for property valuation. I can help you understand Vastu considerations, pricing factors, and traditional home features. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('vastu') || message.includes('vastu shastra')) {
      return AI_RESPONSES.vastu[Math.floor(Math.random() * AI_RESPONSES.vastu.length)];
    } else if (message.includes('price') || message.includes('cost') || message.includes('valuation')) {
      return AI_RESPONSES.pricing[Math.floor(Math.random() * AI_RESPONSES.pricing.length)];
    } else if (message.includes('kerala') || message.includes('traditional') || message.includes('nalukettu')) {
      return AI_RESPONSES.kerala[Math.floor(Math.random() * AI_RESPONSES.kerala.length)];
    } else {
      return AI_RESPONSES.general[Math.floor(Math.random() * AI_RESPONSES.general.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-80 h-96 bg-white/95 backdrop-blur-md border shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="h-64 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'ai' && (
                            <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                          )}
                          {message.sender === 'user' && (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about Vastu, pricing, or homes..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
