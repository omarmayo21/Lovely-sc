export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string;
          id: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name: string;
          id: string;
          role?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      brands: {
        Row: {
          created_at: string;
          description: string | null;
          display_order: number;
          id: string;
          logo_url: string | null;
          name: string;
          origin: string;
          origin_label: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          logo_url?: string | null;
          name: string;
          origin?: string;
          origin_label?: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          logo_url?: string | null;
          name?: string;
          origin?: string;
          origin_label?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          display_order: number;
          english_name: string | null;
          icon: string | null;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          english_name?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          english_name?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          code: string;
          created_at: string;
          discount_percentage: number;
          expiry_date: string;
          id: string;
          is_active: boolean;
          min_order_amount: number | null;
          updated_at: string;
          usage_count: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          discount_percentage: number;
          expiry_date: string;
          id?: string;
          is_active?: boolean;
          min_order_amount?: number | null;
          updated_at?: string;
          usage_count?: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          discount_percentage?: number;
          expiry_date?: string;
          id?: string;
          is_active?: boolean;
          min_order_amount?: number | null;
          updated_at?: string;
          usage_count?: number;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          address: string;
          created_at: string;
          id: string;
          last_order_date: string | null;
          name: string;
          phone: string;
          total_orders: number;
          total_spent: number;
          updated_at: string;
        };
        Insert: {
          address: string;
          created_at?: string;
          id?: string;
          last_order_date?: string | null;
          name: string;
          phone: string;
          total_orders?: number;
          total_spent?: number;
          updated_at?: string;
        };
        Update: {
          address?: string;
          created_at?: string;
          id?: string;
          last_order_date?: string | null;
          name?: string;
          phone?: string;
          total_orders?: number;
          total_spent?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory_logs: {
        Row: {
          change_type: string;
          created_at: string;
          created_by: string | null;
          id: string;
          new_stock: number;
          previous_stock: number;
          product_id: string;
          reason: string | null;
        };
        Insert: {
          change_type: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          new_stock: number;
          previous_stock: number;
          product_id: string;
          reason?: string | null;
        };
        Update: {
          change_type?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          new_stock?: number;
          previous_stock?: number;
          product_id?: string;
          reason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          brand_name: string;
          created_at: string;
          id: string;
          image_url: string | null;
          order_id: string;
          price: number;
          product_id: string | null;
          product_name: string;
          quantity: number;
        };
        Insert: {
          brand_name: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          order_id: string;
          price: number;
          product_id?: string | null;
          product_name: string;
          quantity: number;
        };
        Update: {
          brand_name?: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          order_id?: string;
          price?: number;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          created_at: string;
          customer_address: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          discount: number;
          id: string;
          notes: string | null;
          order_number: string;
          status: string;
          subtotal: number;
          total: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          customer_address: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          discount?: number;
          id?: string;
          notes?: string | null;
          order_number: string;
          status?: string;
          subtotal: number;
          total: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          customer_address?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          discount?: number;
          id?: string;
          notes?: string | null;
          order_number?: string;
          status?: string;
          subtotal?: number;
          total?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      product_images: {
        Row: {
          created_at: string;
          display_order: number;
          id: string;
          image_url: string;
          is_primary: boolean;
          product_id: string;
        };
        Insert: {
          created_at?: string;
          display_order?: number;
          id?: string;
          image_url: string;
          is_primary?: boolean;
          product_id: string;
        };
        Update: {
          created_at?: string;
          display_order?: number;
          id?: string;
          image_url?: string;
          is_primary?: boolean;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          brand_id: string | null;
          brand_name: string;
          brand_slug: string;
          category_id: string | null;
          category_name: string;
          category_slug: string;
          created_at: string;
          description: string;
          discount_price: number | null;
          english_name: string | null;
          featured: boolean;
          how_to_use: string | null;
          id: string;
          ingredients: string | null;
          is_active: boolean;
          is_bestseller: boolean;
          is_new: boolean;
          key_ingredients: string[] | null;
          name: string;
          price: number;
          rating: number;
          reviews_count: number;
          routine_step: string | null;
          skin_type: string[] | null;
          sku: string;
          slug: string;
          stock: number;
          updated_at: string;
          volume: string | null;
        };
        Insert: {
          brand_id?: string | null;
          brand_name: string;
          brand_slug: string;
          category_id?: string | null;
          category_name: string;
          category_slug: string;
          created_at?: string;
          description?: string;
          discount_price?: number | null;
          english_name?: string | null;
          featured?: boolean;
          how_to_use?: string | null;
          id?: string;
          ingredients?: string | null;
          is_active?: boolean;
          is_bestseller?: boolean;
          is_new?: boolean;
          key_ingredients?: string[] | null;
          name: string;
          price: number;
          rating?: number;
          reviews_count?: number;
          routine_step?: string | null;
          skin_type?: string[] | null;
          sku: string;
          slug: string;
          stock?: number;
          updated_at?: string;
          volume?: string | null;
        };
        Update: {
          brand_id?: string | null;
          brand_name?: string;
          brand_slug?: string;
          category_id?: string | null;
          category_name?: string;
          category_slug?: string;
          created_at?: string;
          description?: string;
          discount_price?: number | null;
          english_name?: string | null;
          featured?: boolean;
          how_to_use?: string | null;
          id?: string;
          ingredients?: string | null;
          is_active?: boolean;
          is_bestseller?: boolean;
          is_new?: boolean;
          key_ingredients?: string[] | null;
          name?: string;
          price?: number;
          rating?: number;
          reviews_count?: number;
          routine_step?: string | null;
          skin_type?: string[] | null;
          sku?: string;
          slug?: string;
          stock?: number;
          updated_at?: string;
          volume?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      offers: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          discount_text: string | null;
          link_url: string | null;
          is_active: boolean;
          start_date: string | null;
          end_date: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          discount_text?: string | null;
          link_url?: string | null;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          discount_text?: string | null;
          link_url?: string | null;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      search_events: {
        Row: {
          id: string;
          query: string;
          results_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          query: string;
          results_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          query?: string;
          results_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      store_settings: {
        Row: {
          branch_address: string;
          branch_landmark: string;
          facebook_url: string | null;
          free_shipping_threshold: number | null;
          id: string;
          instagram_url: string | null;
          primary_phone: string;
          secondary_phone: string;
          store_name: string;
          store_subtitle: string;
          updated_at: string;
          whatsapp_number: string;
          working_hours: string;
          google_analytics_id: string | null;
          meta_pixel_id: string | null;
          clarity_project_id: string | null;
          site_title: string | null;
          meta_description: string | null;
          default_og_image: string | null;
          google_verification_code: string | null;
        };
        Insert: {
          branch_address?: string;
          branch_landmark?: string;
          facebook_url?: string | null;
          free_shipping_threshold?: number | null;
          id?: string;
          instagram_url?: string | null;
          primary_phone?: string;
          secondary_phone?: string;
          store_name?: string;
          store_subtitle?: string;
          updated_at?: string;
          whatsapp_number?: string;
          working_hours?: string;
          google_analytics_id?: string | null;
          meta_pixel_id?: string | null;
          clarity_project_id?: string | null;
          site_title?: string | null;
          meta_description?: string | null;
          default_og_image?: string | null;
          google_verification_code?: string | null;
        };
        Update: {
          branch_address?: string;
          branch_landmark?: string;
          facebook_url?: string | null;
          free_shipping_threshold?: number | null;
          id?: string;
          instagram_url?: string | null;
          primary_phone?: string;
          secondary_phone?: string;
          store_name?: string;
          store_subtitle?: string;
          updated_at?: string;
          whatsapp_number?: string;
          working_hours?: string;
          google_analytics_id?: string | null;
          meta_pixel_id?: string | null;
          clarity_project_id?: string | null;
          site_title?: string | null;
          meta_description?: string | null;
          default_og_image?: string | null;
          google_verification_code?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
      place_order_secure: {
        Args: {
          p_customer_name: string;
          p_customer_phone: string;
          p_customer_address: string;
          p_items: any;
          p_subtotal: number;
          p_discount: number;
          p_total: number;
          p_notes?: string | null;
        };
        Returns: any;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
