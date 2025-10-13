-- Add missing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS vector_store_id TEXT;

-- Create social media content table
CREATE TABLE IF NOT EXISTS public.social_media_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content_url TEXT NOT NULL,
  content_type TEXT,
  scrape_data JSONB,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_media_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_media_content
CREATE POLICY "Users can view content for their projects"
  ON public.social_media_content
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = social_media_content.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create content for their projects"
  ON public.social_media_content
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = social_media_content.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete content for their projects"
  ON public.social_media_content
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = social_media_content.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create AI chat sessions table
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  thread_id TEXT NOT NULL,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_chat_sessions
CREATE POLICY "Project owners can view chat sessions"
  ON public.ai_chat_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = ai_chat_sessions.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create chat sessions"
  ON public.ai_chat_sessions
  FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at on ai_chat_sessions
CREATE TRIGGER update_ai_chat_sessions_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();