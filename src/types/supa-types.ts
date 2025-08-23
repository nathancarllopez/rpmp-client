import type { MergeDeep } from "type-fest";
import type { Database as GeneratedDatabase } from "./database.types";

export type Database = MergeDeep<
  GeneratedDatabase,
  {
    public: {
      Views: {
        all_backstock: {
          Row: {
            claimed: boolean;
            created_at: string;
            display_color: string | null;
            id: number;
            is_protein: boolean;
            name: string;
            name_label: string;
            sub_name: string | null;
            sub_name_label: string | null;
            weight: number;
          };
        };
        proteins_with_flavors: {
          Row: {
            flavor_labels: string[];
            flavor_names: string[];
            protein_label: string;
            protein_name: string;
            flavors: {
              name: string;
              label: string;
            }[];
          };
        };
        shop_sheet_template: {
          Row: {
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
        };
      };
    };
  }
>;

export type SupaAllBackstockRow =
  Database["public"]["Views"]["all_backstock"]["Row"];
export type SupaCookSheetSectionsRow =
  Database["public"]["Tables"]["cook_sheet_sections"]["Row"];
export type SupaFlavorRow = Database["public"]["Tables"]["flavors"]["Row"];
export type SupaOrderHeaderRow =
  Database["public"]["Tables"]["order_headers"]["Row"];
export type SupaOrderHistoryRow =
  Database["public"]["Tables"]["order_history"]["Row"];
export type SupaProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type SupaProteinRow = Database["public"]["Tables"]["proteins"]["Row"];
export type SupaPullListRow = Database["public"]["Tables"]["pull_list"]["Row"];
export type SupaRoleInfoRow = Database["public"]["Tables"]["role_info"]["Row"];
export type SupaStoreInfoRow =
  Database["public"]["Tables"]["store_info"]["Row"];
export type SupaShopTemplateRow =
  Database["public"]["Views"]["shop_sheet_template"]["Row"];
export type SupaTimecardHistoryRow =
  Database["public"]["Tables"]["timecards_history"]["Row"];
export type SupaUpdateProfileRow =
  Database["public"]["Tables"]["profiles"]["Update"];
export type SupaVeggieCarbInfoRow =
  Database["public"]["Tables"]["veggies_carbs"]["Row"];
