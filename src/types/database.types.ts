export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          event_address: Json;
          billing_address: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          event_address: Json;
          billing_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          event_address?: Json;
          billing_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: number;
          user_id: string;
          customer_id: string;
          status: string;
          total_amount: number;
          event_date: string | null;
          event_for_name: string | null;
          package_info: Json | null;
          preview_slots: Json | null;
          options: Json | null;
          pickup_info: Json | null;
          reports: Json | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          order_number?: number;
          user_id: string;
          customer_id: string;
          status: string;
          total_amount: number;
          event_date?: string | null;
          event_for_name?: string | null;
          package_info?: Json | null;
          preview_slots?: Json | null;
          options?: Json | null;
          pickup_info?: Json | null;
          reports?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          order_number?: number;
          user_id?: string;
          customer_id?: string;
          status?: string;
          total_amount?: number;
          event_date?: string | null;
          event_for_name?: string | null;
          package_info?: Json | null;
          preview_slots?: Json | null;
          options?: Json | null;
          pickup_info?: Json | null;
          reports?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          sign_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          sign_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          sign_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      signs: {
        Row: {
          id: string;
          serial_number: string;
          name: string;
          event_type: string;
          colors: Json;
          style: string;
          theme: string;
          image_url: string;
          dimensions: Json | null;
          materials: Json | null;
          weight: Json | null;
          notes: string | null;
          inventory: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          serial_number: string;
          name: string;
          event_type: string;
          colors: Json;
          style: string;
          theme: string;
          image_url: string;
          dimensions?: Json | null;
          materials?: Json | null;
          weight?: Json | null;
          notes?: string | null;
          inventory: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          serial_number?: string;
          name?: string;
          event_type?: string;
          colors?: Json;
          style?: string;
          theme?: string;
          image_url?: string;
          dimensions?: Json | null;
          materials?: Json | null;
          weight?: Json | null;
          notes?: string | null;
          inventory?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          name: string;
          price: number;
          sign_count: number;
          setup_days_before: number;
          teardown_days_after: number;
          extra_day_before_price: number;
          extra_day_after_price: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          sign_count: number;
          setup_days_before: number;
          teardown_days_after: number;
          extra_day_before_price: number;
          extra_day_after_price: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          sign_count?: number;
          setup_days_before?: number;
          teardown_days_after?: number;
          extra_day_before_price?: number;
          extra_day_after_price?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
