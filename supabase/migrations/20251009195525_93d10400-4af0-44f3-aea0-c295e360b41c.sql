-- Create projects table to store form inputs
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  form_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generation_status table to track progress per content block
CREATE TABLE public.generation_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'youtube', 'instagram', 'email', 'faq', 'chatbot'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'complete', 'error'
  progress INTEGER NOT NULL DEFAULT 0, -- 0-100
  error_message TEXT,
  estimated_time_remaining INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, content_type)
);

-- Create deliverables table to store generated content
CREATE TABLE public.deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content JSONB NOT NULL,
  file_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, content_type)
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects table
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for generation_status table
CREATE POLICY "Users can view their own generation status"
  ON public.generation_status FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = generation_status.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own generation status"
  ON public.generation_status FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = generation_status.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert generation status for their projects"
  ON public.generation_status FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = generation_status.project_id
    AND projects.user_id = auth.uid()
  ));

-- RLS Policies for deliverables table
CREATE POLICY "Users can view their own deliverables"
  ON public.deliverables FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = deliverables.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert deliverables for their projects"
  ON public.deliverables FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = deliverables.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own deliverables"
  ON public.deliverables FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = deliverables.project_id
    AND projects.user_id = auth.uid()
  ));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_generation_status_updated_at
  BEFORE UPDATE ON public.generation_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at
  BEFORE UPDATE ON public.deliverables
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();