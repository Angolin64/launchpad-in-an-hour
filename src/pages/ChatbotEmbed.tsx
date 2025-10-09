import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatbotEmbed = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId) {
      loadGreeting();
    }
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadGreeting = async () => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('content')
        .eq('project_id', projectId)
        .eq('content_type', 'chatbot')
        .single();

      if (error) throw error;
      
      const content = data?.content as any;
      if (content?.greeting) {
        setGreeting(content.greeting);
      }
    } catch (error) {
      console.error('Error loading greeting:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !projectId || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          projectId,
          message: input,
          conversationHistory,
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Invalid chatbot configuration</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-16 w-16 rounded-full shadow-elegant gradient-primary hover:scale-105 transition-smooth"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="glass w-[400px] h-[600px] flex flex-col shadow-elegant">
          {/* Header */}
          <div className="gradient-primary p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white">AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 && greeting && (
              <div className="mb-4">
                <div className="flex gap-3 items-start">
                  <Avatar className="mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">{greeting}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : 'flex gap-3 items-start'}`}>
                {msg.role === 'assistant' && (
                  <Avatar className="mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex-1 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`rounded-lg p-3 max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'gradient-primary text-white ml-auto' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 items-start mb-4">
                <Avatar className="mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="gradient-primary"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatbotEmbed;
