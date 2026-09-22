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
      contact_clicks: {
        Row: {
          created_at: string
          id: string
          kind: string
          restaurant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          restaurant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_clicks_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
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
      page_visits: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          path: string
          referrer: string | null
          region: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          region?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          region?: string | null
        }
        Relationships: []
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
      restaurant_edit_history: {
        Row: {
          edited_at: string
          id: string
          previous_category_ids: string[]
          previous_data: Json
          restaurant_id: string
        }
        Insert: {
          edited_at?: string
          id?: string
          previous_category_ids?: string[]
          previous_data: Json
          restaurant_id: string
        }
        Update: {
          edited_at?: string
          id?: string
          previous_category_ids?: string[]
          previous_data?: Json
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_edit_history_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_likes: {
        Row: {
          created_at: string
          device_id: string
          restaurant_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          restaurant_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_likes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_page_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          restaurant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          restaurant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_page_events_restaurant_id_fkey"
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
      admin_engagement_by_restaurant: {
        Args: { p_key: string; p_since?: string }
        Returns: {
          call_count: number
          impression_count: number
          name: string
          restaurant_id: string
          slug: string
          view_count: number
          whatsapp_count: number
        }[]
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
      admin_list_recent_edits: {
        Args: { p_key: string }
        Returns: {
          current_blurb: string
          current_name: string
          current_phone_number: string
          current_whatsapp_number: string
          edited_at: string
          history_id: string
          previous_blurb: string
          previous_name: string
          previous_phone_number: string
          previous_whatsapp_number: string
          restaurant_id: string
          restaurant_slug: string
        }[]
      }
      admin_merge_restaurant: {
        Args: { p_existing_id: string; p_key: string; p_pending_id: string }
        Returns: boolean
      }
      admin_reject_restaurant: {
        Args: { p_id: string; p_key: string }
        Returns: undefined
      }
      admin_revert_restaurant_edit: {
        Args: { p_history_id: string; p_key: string }
        Returns: boolean
      }
      admin_visits_by_city: {
        Args: { p_key: string; p_since?: string }
        Returns: {
          city: string
          region: string
          visit_count: number
        }[]
      }
      delete_menu_item_by_token: {
        Args: { p_item_id: string; p_token: string }
        Returns: undefined
      }
      get_contact_click_counts: {
        Args: { p_token: string }
        Returns: {
          call_count: number
          whatsapp_count: number
        }[]
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
      get_restaurant_like_info: {
        Args: { p_device_id: string; p_restaurant_id: string }
        Returns: {
          like_count: number
          liked_by_me: boolean
        }[]
      }
      get_restaurant_stats: {
        Args: { p_token: string }
        Returns: {
          call_count: number
          impression_count: number
          view_count: number
          whatsapp_count: number
        }[]
      }
      log_contact_click: {
        Args: { p_kind: string; p_restaurant_id: string }
        Returns: undefined
      }
      log_page_visit: {
        Args: {
          p_city?: string
          p_country?: string
          p_path: string
          p_referrer?: string
          p_region?: string
        }
        Returns: undefined
      }
      log_restaurant_impressions: {
        Args: { p_restaurant_ids: string[] }
        Returns: undefined
      }
      log_restaurant_view: {
        Args: { p_restaurant_id: string }
        Returns: undefined
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
      toggle_restaurant_like: {
        Args: { p_device_id: string; p_restaurant_id: string }
        Returns: boolean
      }
      update_restaurant_info_by_token: {
        Args: {
          p_address: string
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
          p_token: string
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

type PublicSchema = Database["public"]

export type Tables<T extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])> =
  (PublicSchema["Tables"] & PublicSchema["Views"])[T] extends { Row: infer R } ? R : never

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T] extends { Update: infer U } ? U : never

export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]

export type CompositeTypes<T extends keyof PublicSchema["CompositeTypes"]> =
  PublicSchema["CompositeTypes"][T]

export const Constants = {
  public: {
    Enums: {},
  },
} as const
