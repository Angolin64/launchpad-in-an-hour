-- Fix ai_chat_sessions RLS policies

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON ai_chat_sessions;

-- Create new INSERT policy that validates project exists
CREATE POLICY "Public chatbot session creation with validation"
ON ai_chat_sessions FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE id = ai_chat_sessions.project_id)
);

-- Add UPDATE policy for project owners
CREATE POLICY "Project owners can update sessions"
ON ai_chat_sessions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = ai_chat_sessions.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Add DELETE policy for project owners
CREATE POLICY "Project owners can delete sessions"
ON ai_chat_sessions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = ai_chat_sessions.project_id 
    AND projects.user_id = auth.uid()
  )
);