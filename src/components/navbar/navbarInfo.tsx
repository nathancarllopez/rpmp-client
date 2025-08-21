import type { NavbarInfo } from "@/types/rpmp-types";
import {
  IconReceiptDollar,
  IconSnowflake,
  IconToolsKitchen3,
  IconUsers,
} from "@tabler/icons-react";

export const navbarInfo: NavbarInfo[] = [
  {
    id: "orders",
    label: "Orders",
    icon: <IconToolsKitchen3 />,
    hasPermission: ["admin", "owner", "manager"],
    sublinks: [
      {
        id: "process-order",
        label: "Process Order",
        href: "/dashboard/process-order",
      },
      {
        id: "order-history",
        label: "Order History",
        href: "/dashboard/order-history",
      }
    ],
  },
  {
    id: "backstock",
    label: "Backstock",
    icon: <IconSnowflake />,
    href: "/dashboard/backstock",
    hasPermission: ["admin", "owner", "manager"],
  },
  {
    id: "timecards",
    label: "Timecards",
    icon: <IconReceiptDollar />,
    hasPermission: ["admin", 'owner', "manager", "employee"],
    sublinks: [
      {
        id: "create-timecards",
        label: "Create Timecards",
        href: "/dashboard/create-timecards"
      },
      {
        id: "timecard-history",
        label: "Timecard History",
        href: "/dashboard/timecard-history"
      },
    ],
  },
  {
    id: "employees",
    label: "Employees",
    icon: <IconUsers />,
    href: "/dashboard/employees",
    hasPermission: ["admin", 'owner'],
  },
];