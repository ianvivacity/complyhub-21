export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      compliance_records: {
        Row: {
          compliance_item: string
          compliance_status: string
          created_at: string
          file_name: string | null
          file_path: string | null
          id: string
          next_review_date: string | null
          notes: string | null
          organisation_id: string | null
          responsible_person: string
          review_status: string | null
          standard_clause: string
          updated_at: string
        }
        Insert: {
          compliance_item: string
          compliance_status: string
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          next_review_date?: string | null
          notes?: string | null
          organisation_id?: string | null
          responsible_person: string
          review_status?: string | null
          standard_clause: string
          updated_at?: string
        }
        Update: {
          compliance_item?: string
          compliance_status?: string
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          next_review_date?: string | null
          notes?: string | null
          organisation_id?: string | null
          responsible_person?: string
          review_status?: string | null
          standard_clause?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_records_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invite_token: string
          invited_by: string
          organisation_id: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invite_token: string
          invited_by: string
          organisation_id: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by?: string
          organisation_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "organisation_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action: string
          created_at: string
          created_by: string
          id: string
          is_read: boolean
          message: string
          organisation_id: string
          record_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          created_by: string
          id?: string
          is_read?: boolean
          message: string
          organisation_id: string
          record_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string
          id?: string
          is_read?: boolean
          message?: string
          organisation_id?: string
          record_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      organisation_members: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          organisation_id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          organisation_id: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          organisation_id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          branding_color: string | null
          contact_email: string | null
          contact_number: string | null
          created_at: string
          id: string
          name: string
          rto_id: string | null
          updated_at: string
        }
        Insert: {
          branding_color?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          id?: string
          name: string
          rto_id?: string | null
          updated_at?: string
        }
        Update: {
          branding_color?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          id?: string
          name?: string
          rto_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      standards: {
        Row: {
          created_at: string
          id: string
          organisation_id: string
          standard_clause: string
          standard_description: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organisation_id: string
          standard_clause: string
          standard_description: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organisation_id?: string
          standard_clause?: string
          standard_description?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "standards_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_org_notification: {
        Args: {
          p_organisation_id: string
          p_type: string
          p_action: string
          p_title: string
          p_message: string
          p_record_id?: string
          p_created_by?: string
        }
        Returns: string
      }
      get_user_organisation: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_organisation_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id: string; org_id: string }
        Returns: string
      }
      send_invitation: {
        Args: {
          _email: string
          _organisation_id: string
          _expires_in_days?: number
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "member"],
    },
  },
} as const
