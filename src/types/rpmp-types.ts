import type { ReactNode } from "react";
import { Constants, type Json } from "./database.types";
import type {
  Database,
  SupaProfileRow,
  SupaAllBackstockRow,
  SupaFlavorRow,
  SupaOrderHeaderRow,
  SupaOrderHistoryRow,
  SupaProteinRow,
  SupaProteinWithFlavorsRow,
  SupaPullListRow,
  SupaRoleInfoRow,
  SupaTimecardHistoryRow,
  SupaVeggieCarbInfoRow,
  SupaStoreInfoRow,
  SupaShopTemplateRow,
  SupaCookSheetSectionsRow
} from "./supa-types";

type CamelCase<S extends string> = S extends `${infer P}_${infer R}`
  ? `${P}${Capitalize<CamelCase<R>>}`
  : S;

// E is a map of exceptions
type ToCamelCase<T, E extends Record<string, any> = {}> = {
  [K in keyof T as CamelCase<K & string>]:
    CamelCase<K & string> extends keyof E
      ? E[CamelCase<K & string>]
      : T[K] extends Array<infer U>
        ? Array<ToCamelCase<U, E>>
        : T[K] extends object
          ? ToCamelCase<T[K], E>
          : T[K];
};

/**
 * *****************************
 *           BACKSTOCK
 * *****************************
 */
//#region
export type AllBackstockRow = ToCamelCase<SupaAllBackstockRow>;

export type InsertBackstockRow =
  Database["public"]["Tables"]["backstock_proteins"]["Insert"];
//#endregion

/**
 * *****************************
 *           ORDERS
 * *****************************
 */
//#region
export type InsertOrderHistoryRow =
  Database["public"]["Tables"]["order_history"]["Insert"];

// export const containerSizes = Constants["public"]["Enums"]["container_size"];

export type ContainerSize = Database["public"]["Enums"]["container_size"];

export type FlavorRow = ToCamelCase<SupaFlavorRow>;
export type OrderHeaderRow = ToCamelCase<SupaOrderHeaderRow>;
// export type ProteinWithFlavorsRow = ToCamelCase<SupaProteinWithFlavorsRow>;
export type PullListRow = ToCamelCase<SupaPullListRow>;
export type StoreInfoRow = ToCamelCase<SupaStoreInfoRow>;
export type ShopTemplateRow = ToCamelCase<SupaShopTemplateRow>;
export type VeggieCarbInfoRow = ToCamelCase<
  SupaVeggieCarbInfoRow,
  { amounts: { [mealCount: number]: number} }
>
export type ProteinRow = ToCamelCase<
  SupaProteinRow,
  { flavors: FlavorInfo[] }
>;
export type CookSheetSectionRow = ToCamelCase<
  SupaCookSheetSectionsRow,
  {
    columns: { property: string, label: string }[],
    footers: { name: string, label: string }[]
  }
>

export interface FlavorInfo {
  protein: string;
  name: string;
  label: string;
  baseName: string;
  rawLabel: string;
  // cookColumn: string; // Delete
  cookRow: number;
  cookLabel: string | null;
  sauceMultiplier: number | null;
}

export interface FlavorInfoWithCalcs extends FlavorInfo {
  orderedWeight: number;
  weightToCook: number;
  weightLbOz: string;
  cookedTeriyaki: string | null;
  sauce: string | null;
}

export interface ProteinRowWithCalcs extends ProteinRow {
  flavorInfo: Record<string, FlavorInfoWithCalcs>;
  totalWeightToCook: number
}

export type AllProteinInfo = Record<string, ProteinRowWithCalcs>

export interface SelectedBackstockRow extends AllBackstockRow {
  action: "edit" | "delete";
}

export interface UpdateBackstockInfo {
  [id: string]: {
    weight: number;
    created_at: string; // timestampz in supabase, new Date().toISOString() here
    deleted_on?: string | null; // Including this property performs a soft delete, i.e., it changes the column in the backstock table, and excluding it ignores that column. The string is a timestampz and null undoes the soft delete
    claimed: boolean;
  };
}

// export interface OrderStatistics {
//   orders: number;
//   mealCount: number;
//   veggieMeals: number;
//   thankYouBags: number;
//   totalProteinWeight: number;
//   teriyakiCuppyCount: number;
//   extraRoastedVeggies: number;
//   proteinCubes: Record<string, number>;
//   containers: Partial<Record<ContainerSize, number>>;
//   proteins: IngredientAmounts;
//   veggieCarbs: IngredientAmounts;
//   carbsToCook: IngredientAmounts;
// }

export interface OrderStatistics {
  numOrders: number;
  numMeals: number;
  numVeggieMeals: number;
  numThankYouBags: number;
  totalProteinWeight: number;
  containers: Partial<Record<ContainerSize, number>>;
  proteins: IngredientAmounts;
  veggieCarbs: AllVeggieCarbInfo;
}

export interface Order {
  fullName: string;
  itemName: string;
  container: ContainerSize;
  weight: number;
  flavor: string;
  flavorLabel: string;
  protein: string;
  proteinLabel: string;
  quantity: number;
}

export interface OrderError {
  error: Error | null;
  message: string;
  order: Order;
}

export interface IngredientAmounts {
  [name: string]: {
    label: string;
    amount: number;
    lbsPer: number;
    units: string;
    ingredientType: "proteins" | "veggies" | "carbs" | "misc"
  };
}

export interface Meal {
  protein: string;
  proteinLabel: string;
  flavor: string;
  flavorLabel: string;
  orderedWeight: number;  // Amount ordered by customer
  weightAfterBackstock: number;   // Amount after backstock adjustment
  weightToCook: number;    // Amount before shrink, i.e., amount to cook
  weightLbOz: string;
  backstockWeight: number;
  displayColor: string | null;
}

// export interface ProteinWeights {
//   [protein: string]: {
//     [flavor: string]: {
//       proteinLabel: string;
//       flavorLabel: string;
//       weight: number;
//     };
//   };
// }

export interface OrderReportInfo {
  orders: Order[];
  orderErrors: OrderError[];
  usedBackstockIds: Set<number>;
  meals: Meal[];
  stats: OrderStatistics;
  pullListInfo: {
    extraRoastedVeggies: number;
    pullRows: PullListRow[];
  }
  shopSheetRows: ShopRowsByStore;
  cookSheetInfo: CookSheetInfo;
  proteinInfo: AllProteinInfo;
}

export interface CarbToCook {
  displayOrder: number,
  name: string,
  label: string,
  amountWithUnits: string,
  water: string | null,
  note: string | null
}

export interface CookSheetInfo {
  numTeriyakiCuppies: number;
  proteinCubes: Record<string, number>;
  carbsToCook: CarbToCook[];
}

export interface AllVeggieCarbInfo {
  [name: string]: {
    label: string;
    amount: number;
    lbsPer: number;
    units: string;
    ingredientType: "veggies" | "carbs";
    cookDisplayOrder: number | null;
    cookLabel: string | null;
    waterMultiplier: number | null;
  }
}

export interface StoreRow {
  storeName: string;
  name: string;
  label: string;
  purchaseLabel: string | null;
  price: number;
  locationInStore: string | null;
  quantity: number;
  editable: boolean;
}

export type ShopRowsByStore = Map<string, StoreRow[]>

export type OrderHistoryRow = ToCamelCase<
  SupaOrderHistoryRow,
  { data: OrderReportInfo }
>
//#endregion

/**
 * *****************************
 *           PROFILE
 * *****************************
 */
//#region
// export type InsertProfileRow =
//   Database["public"]["Tables"]["profiles"]["Insert"];

export type ProfileRow = ToCamelCase<SupaProfileRow>;
export type RoleInfoRow = ToCamelCase<SupaRoleInfoRow>;

// export interface NewUserInfo {
//   email: string;
//   profileData: {
//     firstName: string;
//     lastName: string;
//     role: string;
//     email: string;
//     kitchenRate: number | null;
//     drivingRate: number | null;
//     displayColor: string | null;
//   };
// }

// export interface CreatedUserInfo {
//   profile: ProfileRow;
//   profilePicUrl: string;
//   settings: SettingsRow;
// }
//#endregion

/**
 * *****************************
 *           TIMECARDS
 * *****************************
 */
//#region
// export type InsertTimecardHistoryRow =
//   Database["public"]["Tables"]["timecards_history"]["Insert"];

// export interface TimecardValues extends ProfileRow {
//   hasChanged: boolean;
//   renderKey: number;

//   profilePicUrl: string;

//   drivingRate: number;
//   kitchenRate: number;

//   sundayStart: string;
//   sundayEnd: string;
//   sundayTotalHours: number;
//   sundayOvertimeHours: number;
//   sundayOvertimePay: number;
//   sundayRegularPay: number;
//   sundayTotalPay: number;

//   mondayStart: string;
//   mondayEnd: string;
//   mondayTotalHours: number;
//   mondayOvertimeHours: number;
//   mondayOvertimePay: number;
//   mondayRegularPay: number;
//   mondayTotalPay: number;

//   drivingStart: string;
//   drivingEnd: string;
//   drivingTotalHours: number;
//   drivingOvertimeHours: number;
//   drivingOvertimePay: number;
//   drivingRegularPay: number;
//   drivingTotalPay: number;
//   costPerStop: number;
//   drivingTotalCost: number;
//   route1: number | "";
//   route2: number | "";
//   stops: number;

//   miscDescription: string;
//   miscAmount: number | "";
//   miscPayCode: string;

//   grandTotal: number;
// }

// export interface TimecardDisplayValues {
//   fullName: string;

//   kitchenRate: string;
//   drivingRate: string;

//   sundayStart: string;
//   sundayEnd: string;
//   sundayTotalHours: string;
//   sundayOvertimeHours: string;
//   sundayRegularPay: string;
//   sundayOvertimePay: string;
//   sundayTotalPay: string;

//   mondayStart: string;
//   mondayEnd: string;
//   mondayTotalHours: string;
//   mondayOvertimeHours: string;
//   mondayRegularPay: string;
//   mondayOvertimePay: string;
//   mondayTotalPay: string;

//   drivingStart: string;
//   drivingEnd: string;
//   drivingTotalHours: string;
//   drivingOvertimeHours: string;
//   drivingRegularPay: string;
//   drivingOvertimePay: string;
//   drivingTotalPay: string;
//   route1: string;
//   route2: string;

//   stops: string;
//   costPerStop: string;
//   drivingTotalCost: string;

//   miscAmount: string;
//   miscDescription: string;
//   miscPayCode: string;

//   grandTotal: string;
// }

// export type TimecardHistoryRow = ToCamelCase<
//   SupaTimecardHistoryRow,
//   { data: TimecardValues[] }
// >;
//#endregion

/**
 * *****************************
 *           TEMPLATES
 * *****************************
 */
//#region
// export interface UpdatePullListInfo {
//   idsToDelete: Set<number>;
//   updates: PullListRow[];
// }
//#endregion

/**
 * *****************************
 *           UI
 * *****************************
 */
//#region
interface NavbarLinkInfo {
  id: string;
  label: string;
  href?: string;
}

export interface NavbarInfo extends NavbarLinkInfo {
  hasPermission: string[];
  icon: ReactNode;
  sublinks?: NavbarLinkInfo[];
}
//#endregion


/**
 * *****************************
 *           SETTINGS
 * *****************************
 */
//#region
// export type InsertSettingsRow =
//   Database["public"]["Tables"]["settings"]["Insert"];

// export type UpdateSettingsInfo =
//   Database["public"]["Tables"]["settings"]["Update"];

// export interface SettingsRow {
//   userId: string;
//   general: GeneralSettings;
//   orders: OrderSettings;
//   backstock: BackstockSettings;
//   timecards: TimecardsSettings;
//   finances: FinancesSettings;
//   menu: MenuSettings;
//   employees: EmployeesSettings;
// }

// export interface GeneralSettings extends Record<string, Json> {}

// export interface OrderSettings extends Record<string, Json> {
//   skipEdits: boolean;
// }

// export interface BackstockSettings extends Record<string, Json> {}

// export interface TimecardsSettings extends Record<string, Json> {}

// export interface FinancesSettings extends Record<string, Json> {}

// export interface MenuSettings extends Record<string, Json> {}

// export interface EmployeesSettings extends Record<string, Json> {}
//#endregion
