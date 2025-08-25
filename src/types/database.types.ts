export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      backstock_proteins: {
        Row: {
          claimed: boolean;
          created_at: string;
          deleted_on: string | null;
          flavor: string;
          id: number;
          protein: string;
          weight: number;
        };
        Insert: {
          claimed: boolean;
          created_at?: string;
          deleted_on?: string | null;
          flavor: string;
          id?: number;
          protein: string;
          weight: number;
        };
        Update: {
          claimed?: boolean;
          created_at?: string;
          deleted_on?: string | null;
          flavor?: string;
          id?: number;
          protein?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "backstock_flavor_fkey";
            columns: ["flavor"];
            isOneToOne: false;
            referencedRelation: "flavors";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "backstock_protein_fkey";
            columns: ["protein"];
            isOneToOne: false;
            referencedRelation: "proteins";
            referencedColumns: ["name"];
          },
        ];
      };
      backstock_veggie_carb: {
        Row: {
          claimed: boolean;
          created_at: string;
          deleted_on: string | null;
          id: number;
          units: string;
          veggie_carb: string;
          weight: number;
        };
        Insert: {
          claimed: boolean;
          created_at?: string;
          deleted_on?: string | null;
          id?: number;
          units: string;
          veggie_carb: string;
          weight: number;
        };
        Update: {
          claimed?: boolean;
          created_at?: string;
          deleted_on?: string | null;
          id?: number;
          units?: string;
          veggie_carb?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "backstock_veggie_carb_veggie_carb_fkey";
            columns: ["veggie_carb"];
            isOneToOne: false;
            referencedRelation: "veggies_carbs";
            referencedColumns: ["name"];
          },
        ];
      };
      carbs: {
        Row: {
          amounts: Json | null;
          id: number | null;
          label: string | null;
          lbs_per: number | null;
          name: string | null;
          units: string | null;
        };
        Insert: {
          amounts?: Json | null;
          id?: number | null;
          label?: string | null;
          lbs_per?: number | null;
          name?: string | null;
          units?: string | null;
        };
        Update: {
          amounts?: Json | null;
          id?: number | null;
          label?: string | null;
          lbs_per?: number | null;
          name?: string | null;
          units?: string | null;
        };
        Relationships: [];
      };
      cook_sheet_sections: {
        Row: {
          columns: Json[];
          display_color: string;
          display_order: number;
          id: number;
          label: string;
          name: string;
          page_break_after: boolean;
        };
        Insert: {
          columns: Json[];
          display_color: string;
          display_order: number;
          id?: number;
          label: string;
          name: string;
          page_break_after: boolean;
        };
        Update: {
          columns?: Json[];
          display_color?: string;
          display_order?: number;
          id?: number;
          label?: string;
          name?: string;
          page_break_after?: boolean;
        };
        Relationships: [];
      };
      costco_shop: {
        Row: {
          display_order: number;
          id: number;
          item_size: number | null;
          item_type: string;
          label: string;
          location_in_store: string | null;
          name: string;
          price: number;
          purchase_label: string | null;
        };
        Insert: {
          display_order: number;
          id?: number;
          item_size?: number | null;
          item_type: string;
          label: string;
          location_in_store?: string | null;
          name: string;
          price: number;
          purchase_label?: string | null;
        };
        Update: {
          display_order?: number;
          id?: number;
          item_size?: number | null;
          item_type?: string;
          label?: string;
          location_in_store?: string | null;
          name?: string;
          price?: number;
          purchase_label?: string | null;
        };
        Relationships: [];
      };
      flavors: {
        Row: {
          base_flavor: string | null;
          id: number;
          label: string;
          name: string;
          proteins: string[] | null;
          raw_label: string;
        };
        Insert: {
          base_flavor?: string | null;
          id?: number;
          label: string;
          name: string;
          proteins?: string[] | null;
          raw_label: string;
        };
        Update: {
          base_flavor?: string | null;
          id?: number;
          label?: string;
          name?: string;
          proteins?: string[] | null;
          raw_label?: string;
        };
        Relationships: [];
      };
      misc_ingredients: {
        Row: {
          id: number;
          label: string;
          location_in_store: string | null;
          name: string;
          price: number;
          purchase_label: string | null;
          purchase_size: number | null;
          shop_display_order: number;
          shop_label: string | null;
          store_name: string;
        };
        Insert: {
          id?: number;
          label: string;
          location_in_store?: string | null;
          name: string;
          price: number;
          purchase_label?: string | null;
          purchase_size?: number | null;
          shop_display_order: number;
          shop_label?: string | null;
          store_name: string;
        };
        Update: {
          id?: number;
          label?: string;
          location_in_store?: string | null;
          name?: string;
          price?: number;
          purchase_label?: string | null;
          purchase_size?: number | null;
          shop_display_order?: number;
          shop_label?: string | null;
          store_name?: string;
        };
        Relationships: [];
      };
      order_headers: {
        Row: {
          id: number;
          label: string;
          name: string;
          raw_label: string | null;
        };
        Insert: {
          id?: number;
          label: string;
          name: string;
          raw_label?: string | null;
        };
        Update: {
          id?: number;
          label?: string;
          name?: string;
          raw_label?: string | null;
        };
        Relationships: [];
      };
      order_history: {
        Row: {
          added_by: string;
          created_at: string;
          data: Json;
          id: number;
        };
        Insert: {
          added_by: string;
          created_at?: string;
          data: Json;
          id?: number;
        };
        Update: {
          added_by?: string;
          created_at?: string;
          data?: Json;
          id?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_color: string | null;
          driving_rate: number | null;
          email: string;
          first_name: string;
          for_portfolio: boolean;
          full_name: string;
          id: number;
          kitchen_rate: number | null;
          last_name: string;
          profile_pic_name: string | null;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          display_color?: string | null;
          driving_rate?: number | null;
          email?: string;
          first_name: string;
          for_portfolio?: boolean;
          full_name?: string;
          id?: number;
          kitchen_rate?: number | null;
          last_name: string;
          profile_pic_name?: string | null;
          role?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          display_color?: string | null;
          driving_rate?: number | null;
          email?: string;
          first_name?: string;
          for_portfolio?: boolean;
          full_name?: string;
          id?: number;
          kitchen_rate?: number | null;
          last_name?: string;
          profile_pic_name?: string | null;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      proteins: {
        Row: {
          display_color: string;
          flavors: Json[];
          id: number;
          label: string;
          lbs_per: number;
          location_in_store: string | null;
          name: string;
          price: number;
          purchase_label: string | null;
          purchase_size: number | null;
          shop_display_order: number;
          shop_label: string | null;
          shrink: number;
          store_name: string;
        };
        Insert: {
          display_color: string;
          flavors?: Json[];
          id?: number;
          label?: string;
          lbs_per: number;
          location_in_store?: string | null;
          name: string;
          price: number;
          purchase_label?: string | null;
          purchase_size?: number | null;
          shop_display_order: number;
          shop_label?: string | null;
          shrink?: number;
          store_name: string;
        };
        Update: {
          display_color?: string;
          flavors?: Json[];
          id?: number;
          label?: string;
          lbs_per?: number;
          location_in_store?: string | null;
          name?: string;
          price?: number;
          purchase_label?: string | null;
          purchase_size?: number | null;
          shop_display_order?: number;
          shop_label?: string | null;
          shrink?: number;
          store_name?: string;
        };
        Relationships: [];
      };
      pull_list: {
        Row: {
          display_order: number;
          freezer_monday: boolean;
          freezer_sunday: boolean;
          id: number;
          label: string;
          name: string;
        };
        Insert: {
          display_order: number;
          freezer_monday: boolean;
          freezer_sunday: boolean;
          id?: number;
          label: string;
          name: string;
        };
        Update: {
          display_order?: number;
          freezer_monday?: boolean;
          freezer_sunday?: boolean;
          id?: number;
          label?: string;
          name?: string;
        };
        Relationships: [];
      };
      restaurant_depot_shop: {
        Row: {
          display_order: number;
          id: number;
          item_size: number | null;
          item_type: string;
          label: string;
          location_in_store: string | null;
          name: string;
          price: number;
          purchase_label: string | null;
        };
        Insert: {
          display_order: number;
          id?: number;
          item_size?: number | null;
          item_type: string;
          label: string;
          location_in_store?: string | null;
          name: string;
          price: number;
          purchase_label?: string | null;
        };
        Update: {
          display_order?: number;
          id?: number;
          item_size?: number | null;
          item_type?: string;
          label?: string;
          location_in_store?: string | null;
          name?: string;
          price?: number;
          purchase_label?: string | null;
        };
        Relationships: [];
      };
      role_info: {
        Row: {
          explanation: string;
          id: number;
          label: string;
          name: string;
        };
        Insert: {
          explanation: string;
          id?: number;
          label: string;
          name: string;
        };
        Update: {
          explanation?: string;
          id?: number;
          label?: string;
          name?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          backstock: Json;
          employees: Json;
          finances: Json;
          general: Json;
          id: number;
          menu: Json;
          orders: Json;
          timecards: Json;
          user_id: string;
        };
        Insert: {
          backstock: Json;
          employees: Json;
          finances: Json;
          general: Json;
          id?: number;
          menu: Json;
          orders: Json;
          timecards: Json;
          user_id: string;
        };
        Update: {
          backstock?: Json;
          employees?: Json;
          finances?: Json;
          general?: Json;
          id?: number;
          menu?: Json;
          orders?: Json;
          timecards?: Json;
          user_id?: string;
        };
        Relationships: [];
      };
      store_info: {
        Row: {
          display_order: number;
          id: number;
          store_label: string;
          store_name: string;
        };
        Insert: {
          display_order: number;
          id?: number;
          store_label: string;
          store_name: string;
        };
        Update: {
          display_order?: number;
          id?: number;
          store_label?: string;
          store_name?: string;
        };
        Relationships: [];
      };
      timecards_history: {
        Row: {
          added_by: string;
          created_at: string;
          data: Json;
          id: number;
        };
        Insert: {
          added_by: string;
          created_at?: string;
          data: Json;
          id?: number;
        };
        Update: {
          added_by?: string;
          created_at?: string;
          data?: Json;
          id?: number;
        };
        Relationships: [];
      };
      veggies_carbs: {
        Row: {
          amounts: Json;
          cook_display_order: number | null;
          cook_label: string | null;
          id: number;
          is_veggie: boolean;
          label: string;
          lbs_per: number;
          location_in_store: string | null;
          name: string;
          price: number | null;
          purchase_label: string | null;
          purchase_size: number | null;
          shop_display_order: number | null;
          shop_label: string | null;
          stats_display_order: number | null;
          store_name: string;
          units: string;
          water_multiplier: number | null;
        };
        Insert: {
          amounts: Json;
          cook_display_order?: number | null;
          cook_label?: string | null;
          id?: number;
          is_veggie?: boolean;
          label: string;
          lbs_per?: number;
          location_in_store?: string | null;
          name: string;
          price?: number | null;
          purchase_label?: string | null;
          purchase_size?: number | null;
          shop_display_order?: number | null;
          shop_label?: string | null;
          stats_display_order?: number | null;
          store_name: string;
          units: string;
          water_multiplier?: number | null;
        };
        Update: {
          amounts?: Json;
          cook_display_order?: number | null;
          cook_label?: string | null;
          id?: number;
          is_veggie?: boolean;
          label?: string;
          lbs_per?: number;
          location_in_store?: string | null;
          name?: string;
          price?: number | null;
          purchase_label?: string | null;
          purchase_size?: number | null;
          shop_display_order?: number | null;
          shop_label?: string | null;
          stats_display_order?: number | null;
          store_name?: string;
          units?: string;
          water_multiplier?: number | null;
        };
        Relationships: [];
      };
      walmart_shop: {
        Row: {
          display_order: number;
          id: number;
          item_size: number | null;
          item_type: string;
          label: string;
          location_in_store: string | null;
          name: string;
          price: number;
          purchase_label: string | null;
        };
        Insert: {
          display_order: number;
          id?: number;
          item_size?: number | null;
          item_type: string;
          label: string;
          location_in_store?: string | null;
          name: string;
          price: number;
          purchase_label?: string | null;
        };
        Update: {
          display_order?: number;
          id?: number;
          item_size?: number | null;
          item_type?: string;
          label?: string;
          location_in_store?: string | null;
          name?: string;
          price?: number;
          purchase_label?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      all_backstock: {
        Row: {
          claimed: boolean | null;
          created_at: string | null;
          display_color: string | null;
          id: number | null;
          is_protein: boolean | null;
          name: string | null;
          name_label: string | null;
          sub_name: string | null;
          sub_name_label: string | null;
          weight: number | null;
        };
        Relationships: [];
      };
      shop_sheet_template: {
        Row: {
          label: string | null;
          location_in_store: string | null;
          name: string | null;
          price: number | null;
          purchase_label: string | null;
          purchase_size: number | null;
          shop_display_order: number | null;
          shop_label: string | null;
          store_name: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      update_backstock_rows: {
        Args: { updates: Json };
        Returns: {
          claimed: boolean;
          created_at: string;
          deleted_on: string;
          id: number;
          weight: number;
        }[];
      };
    };
    Enums: {
      container_size: "2.5oz" | "4oz" | "6oz" | "8oz" | "10oz" | "bulk";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      container_size: ["2.5oz", "4oz", "6oz", "8oz", "10oz", "bulk"],
    },
  },
} as const;
