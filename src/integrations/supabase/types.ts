export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_sessions: {
        Row: {
          created_at: string
          customer_email: string | null
          id: string
          project_id: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          id?: string
          project_id: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          id?: string
          project_id?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_config: {
        Row: {
          ai_model: string | null
          auto_open: boolean | null
          auto_speak_responses: boolean | null
          bot_avatar_url: string | null
          bot_name: string | null
          chat_bubble_size: string | null
          company_logo_url: string | null
          company_name: string | null
          conversation_memory_enabled: boolean | null
          created_at: string
          file_upload_enabled: boolean | null
          greeting_message: string | null
          id: string
          max_tokens: number | null
          position: string | null
          project_id: string
          response_style: string | null
          show_typing_indicator: boolean | null
          temperature: number | null
          theme_color: string | null
          updated_at: string
          voice_enabled: boolean | null
          voice_name: string | null
        }
        Insert: {
          ai_model?: string | null
          auto_open?: boolean | null
          auto_speak_responses?: boolean | null
          bot_avatar_url?: string | null
          bot_name?: string | null
          chat_bubble_size?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          conversation_memory_enabled?: boolean | null
          created_at?: string
          file_upload_enabled?: boolean | null
          greeting_message?: string | null
          id?: string
          max_tokens?: number | null
          position?: string | null
          project_id: string
          response_style?: string | null
          show_typing_indicator?: boolean | null
          temperature?: number | null
          theme_color?: string | null
          updated_at?: string
          voice_enabled?: boolean | null
          voice_name?: string | null
        }
        Update: {
          ai_model?: string | null
          auto_open?: boolean | null
          auto_speak_responses?: boolean | null
          bot_avatar_url?: string | null
          bot_name?: string | null
          chat_bubble_size?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          conversation_memory_enabled?: boolean | null
          created_at?: string
          file_upload_enabled?: boolean | null
          greeting_message?: string | null
          id?: string
          max_tokens?: number | null
          position?: string | null
          project_id?: string
          response_style?: string | null
          show_typing_indicator?: boolean | null
          temperature?: number | null
          theme_color?: string | null
          updated_at?: string
          voice_enabled?: boolean | null
          voice_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deliverables: {
        Row: {
          content: Json
          content_type: string
          created_at: string
          file_urls: string[] | null
          id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          content: Json
          content_type: string
          created_at?: string
          file_urls?: string[] | null
          id?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string
          file_urls?: string[] | null
          id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_status: {
        Row: {
          content_type: string
          created_at: string
          error_message: string | null
          estimated_time_remaining: number | null
          id: string
          progress: number
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          error_message?: string | null
          estimated_time_remaining?: number | null
          id?: string
          progress?: number
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          error_message?: string | null
          estimated_time_remaining?: number | null
          id?: string
          progress?: number
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_status_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          form_data: Json
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
          vector_store_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_data: Json
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
          vector_store_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          form_data?: Json
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
          vector_store_id?: string | null
        }
        Relationships: []
      }
      social_media_content: {
        Row: {
          content_type: string | null
          content_url: string
          created_at: string
          id: string
          platform: string
          project_id: string
          scrape_data: Json | null
          scraped_at: string
        }
        Insert: {
          content_type?: string | null
          content_url: string
          created_at?: string
          id?: string
          platform: string
          project_id: string
          scrape_data?: Json | null
          scraped_at?: string
        }
        Update: {
          content_type?: string | null
          content_url?: string
          created_at?: string
          id?: string
          platform?: string
          project_id?: string
          scrape_data?: Json | null
          scraped_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_content_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
