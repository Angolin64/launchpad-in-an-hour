import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIHelperButtonProps {
  fieldType: string;
  context?: string;
  onSuggestion: (suggestion: string) => void;
  disabled?: boolean;
}

export const AIHelperButton = ({ 
  fieldType, 
  context, 
  onSuggestion,
  disabled = false 
}: AIHelperButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("form-ai-helper", {
        body: { fieldType, context },
      });

      if (error) throw error;

      if (data?.suggestion) {
        onSuggestion(data.suggestion);
        toast({
          title: "AI Suggestion",
          description: "Suggestion applied! Feel free to edit it.",
        });
      }
    } catch (error: any) {
      console.error("AI helper error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleGetSuggestion}
      disabled={isLoading || disabled}
      className="ml-2"
      title="Get AI suggestion"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
    </Button>
  );
};
