import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, Eye, Calendar, MapPin, Home, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  type: 'valuation' | 'comparison' | 'view';
  title: string;
  description: string;
  timestamp: Date;
  data: any;
  location?: string;
  price?: number;
  vastuScore?: number;
}

export const HistoryPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('property-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(parsed);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
    setHistory(updatedHistory);
    localStorage.setItem('property-history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('property-history');
    toast({
      title: "History Cleared",
      description: "All history items have been removed."
    });
  };

  const removeItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('property-history', JSON.stringify(updatedHistory));
    toast({
      title: "Item Removed",
      description: "History item has been deleted."
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'valuation': return <Star className="h-4 w-4" />;
      case 'comparison': return <Eye className="h-4 w-4" />;
      case 'view': return <Home className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'valuation': return 'bg-blue-500';
      case 'comparison': return 'bg-green-500';
      case 'view': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      {/* History Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.5 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg"
          size="icon"
        >
          <History className="h-5 w-5" />
        </Button>
        {history.length > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {history.length}
          </Badge>
        )}
      </motion.div>

      {/* History Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-80 h-96 bg-white/95 backdrop-blur-md border shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">History</h3>
                  <Badge variant="secondary" className="text-xs">
                    {history.length}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearHistory}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    ×
                  </Button>
                </div>
              </div>

              {/* History Items */}
              <ScrollArea className="h-80 p-4">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <History className="h-12 w-12 text-muted-foreground mb-4" />
                    <h4 className="font-medium text-muted-foreground mb-2">No History Yet</h4>
                    <p className="text-sm text-muted-foreground">
                      Your property valuations and comparisons will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${getTypeColor(item.type)} text-white`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{item.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {formatTimeAgo(item.timestamp)}
                                </div>
                                {item.location && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {item.location}
                                  </div>
                                )}
                                {item.vastuScore && (
                                  <Badge variant="outline" className="text-xs">
                                    Vastu {item.vastuScore}/10
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hook to use history functionality
export const useHistory = () => {
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const savedHistory = localStorage.getItem('property-history');
    let history: HistoryItem[] = [];
    
    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }

    const updatedHistory = [newItem, ...history].slice(0, 50);
    localStorage.setItem('property-history', JSON.stringify(updatedHistory));
  };

  return { addToHistory };
};
