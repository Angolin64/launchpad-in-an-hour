-- Add chatbot_config table for comprehensive chatbot customization
CREATE TABLE IF NOT EXISTS public.chatbot_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL UNIQUE,
  
  -- Appearance settings
  theme_color TEXT DEFAULT '#8B5CF6',
  bot_name TEXT DEFAULT 'AI Assistant',
  bot_avatar_url TEXT,
  position TEXT DEFAULT 'bottom-right',
  chat_bubble_size TEXT DEFAULT 'large',
  
  -- Behavior settings
  greeting_message TEXT DEFAULT 'Hello! How can I help you today?',
  auto_open BOOLEAN DEFAULT false,
  show_typing_indicator BOOLEAN DEFAULT true,
  response_style TEXT DEFAULT 'friendly',
  
  -- Voice settings
  voice_enabled BOOLEAN DEFAULT false,
  voice_name TEXT DEFAULT 'alloy',
  auto_speak_responses BOOLEAN DEFAULT false,
  
  -- Advanced settings
  ai_model TEXT DEFAULT 'google/gemini-2.5-flash',
  temperature REAL DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 500,
  conversation_memory_enabled BOOLEAN DEFAULT true,
  file_upload_enabled BOOLEAN DEFAULT false,
  
  -- Branding
  company_name TEXT,
  company_logo_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own chatbot config"
  ON public.chatbot_config
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = chatbot_config.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own chatbot config"
  ON public.chatbot_config
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = chatbot_config.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own chatbot config"
  ON public.chatbot_config
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = chatbot_config.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own chatbot config"
  ON public.chatbot_config
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = chatbot_config.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_chatbot_config_updated_at
  BEFORE UPDATE ON public.chatbot_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();