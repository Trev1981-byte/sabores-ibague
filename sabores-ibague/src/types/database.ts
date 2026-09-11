// Generated from the live Supabase project (josxuxityplchyrvlffz) via the
// Supabase MCP `generate_typescript_types` tool — this matches the actual
// database, not a hand-written guess. Regenerate any time the schema
// changes, either the same way or with:
//   npx supabase gen types typescript --project-id josxuxityplchyrvlffz > src/types/database.ts
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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          emoji: string
          id: string
          label: string
          slug: string
          sort_order: number
        }
        Insert: {
          emoji: string
          id?: string
          label: string
          slug: string
          sort_order?: number
        }
        Update: {
          emoji?: string
          id?: string
          label?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          id: string
          name: string
          photo_url: string | null
          price: number | null
          restaurant_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          photo_url?: string | null
          price?: number | null
          restaurant_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          photo_url?: string | null
          price?: number | null
          restaurant_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_categories: {
        Row: {
          category_id: string
          restaurant_id: string
        }
        Insert: {
          category_id: string
          restaurant_id: string
        }
        Update: {
          category_id?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          blurb: string | null
          city: string
          created_at: string
          edit_token: string
          has_delivery: boolean
          has_dine_in: boolean
          has_takeout: boolean
          hours_text: string | null
          id: string
          is_approved: boolean
          is_featured: boolean
          maps_link: string | null
          name: string
          neighborhood: string
          phone_number: string
          photo_url: string | null
          price_level: string
          slug: string
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          blurb?: string | null
          city?: string
          created_at?: string
          edit_token?: string
          has_delivery?: boolean
          has_dine_in?: boolean
          has_takeout?: boolean
          hours_text?: string | null
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          maps_link?: string | null
          name: string
          neighborhood: string
          phone_number: string
          photo_url?: string | null
          price_level: string
          slug: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          blurb?: string | null
          city?: string
          created_at?: string
          edit_token?: string
          has_delivery?: boolean
          has_dine_in?: boolean
          has_takeout?: boolean
          hours_text?: string | null
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          maps_link?: string | null
          name?: string
          neighborhood?: string
          phone_number?: string
          photo_url?: string | null
          price_level?: string
          slug?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_menu_item_by_token: {
        Args: {
          p_name: string
          p_photo_url?: string
          p_price: number
          p_token: string
        }
        Returns: {
          id: string
          name: string
          photo_url: string | null
          price: number | null
          restaurant_id: string
          sort_order: number
        }[]
        SetofOptions: {
          from: "*"
          to: "menu_items"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_approve_restaurant: {
        Args: { p_id: string; p_key: string }
        Returns: undefined
      }
      admin_create_restaurant: {
        Args: {
          p_address?: string
          p_blurb: string
          p_category_ids: string[]
          p_has_delivery: boolean
          p_has_dine_in: boolean
          p_has_takeout: boolean
          p_hours_text: string
          p_key: string
          p_maps_link: string
          p_name: string
          p_neighborhood: string
          p_phone_number: string
          p_price_level: string
          p_slug: string
          p_whatsapp_number: string
        }
        Returns: string
      }
      admin_list_pending: {
        Args: { p_key: string }
        Returns: {
          address: string
          blurb: string
          created_at: string
          has_delivery: boolean
          has_dine_in: boolean
          has_takeout: boolean
          hours_text: string
          id: string
          maps_link: string
          menu_items: Json
          name: string
          neighborhood: string
          phone_number: string
          photo_url: string
          price_level: string
          whatsapp_number: string
        }[]
      }
      admin_reject_restaurant: {
        Args: { p_id: string; p_key: string }
        Returns: undefined
      }
      delete_menu_item_by_token: {
        Args: { p_item_id: string; p_token: string }
        Returns: undefined
      }
      get_restaurant_by_edit_token: {
        Args: { p_token: string }
        Returns: {
          address: string | null
          blurb: string | null
          city: string
          created_at: string
          edit_token: string
          has_delivery: boolean
          has_dine_in: boolean
          has_takeout: boolean
          hours_text: string | null
          id: string
          is_approved: boolean
          is_featured: boolean
          maps_link: string | null
          name: string
          neighborhood: string
          phone_number: string
          photo_url: string | null
          price_level: string
          slug: string
          whatsapp_number: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "restaurants"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      set_menu_item_photo_by_token: {
        Args: { p_item_id: string; p_photo_url: string; p_token: string }
        Returns: undefined
      }
      set_restaurant_photo_by_token: {
        Args: { p_photo_url: string; p_token: string }
        Returns: undefined
      }
      submit_restaurant: {
        Args: {
          p_address?: string
          p_blurb: string
          p_category_ids: string[]
          p_has_delivery: boolean
          p_has_dine_in: boolean
          p_has_takeout: boolean
          p_hours_text: string
          p_maps_link: string
          p_name: string
          p_neighborhood: string
          p_phone_number: string
          p_price_level: string
          p_slug: string
          p_whatsapp_number: string
        }
        Returns: string
      }
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

export type Tables 
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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

export type TablesInsert 
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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

export type TablesUpdate 
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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

export type Enums 
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes 
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
