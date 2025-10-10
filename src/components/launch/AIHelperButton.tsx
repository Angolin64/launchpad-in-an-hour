import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIHelperChat } from "./AIHelperChat";

interface AIHelperButtonProps {
  fieldType: string;
  context?: Record<string, any> | string;
  onSuggestion: (suggestion: string) => void;
  disabled?: boolean;
}

export const AIHelperButton = ({ 
  fieldType, 
  context, 
  onSuggestion,
  disabled = false 
}: AIHelperButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="ml-2"
        title="Open AI chat assistant"
      >
        <Sparkles className="w-4 h-4" />
      </Button>
      <AIHelperChat
        open={isOpen}
        onOpenChange={setIsOpen}
        fieldType={fieldType}
        context={context}
        onApply={onSuggestion}
      />
    </>
  );
};
