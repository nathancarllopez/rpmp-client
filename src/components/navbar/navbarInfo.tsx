import type { NavbarInfo } from "@/types/rpmp-types";
import {
  IconBooks,
  IconMeat,
  IconReceiptDollar,
  IconSnowflake,
  IconTemplate,
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
    id: "finances",
    label: "Finances",
    icon: <IconBooks />,
    hasPermission: ["admin", 'owner'],
    sublinks: [
      {
        id: "calculate-statement",
        label: "Calculate Statement",
        href: "/dashboard/calculate-statement"
      },
      {
        id: "statement-history",
        label: "Statement History",
        href: "/dashboard/statement-history"
      },
    ],
  },
  {
    id: "menu",
    label: "Menu",
    icon: <IconMeat />,
    hasPermission: ["admin", 'owner'],
    sublinks: [
      {
        id: 'proteins',
        label: "Proteins",
        href: "/dashboard/proteins"
      }
    ]
  },
  {
    id: "employees",
    label: "Employees",
    icon: <IconUsers />,
    href: "/dashboard/employees",
    hasPermission: ["admin", 'owner'],
  },
  {
    id: "templates",
    label: "Templates",
    icon: <IconTemplate />,
    hasPermission: ["admin", "owner", "manager"],
    sublinks: [
      {
        id: "pull-list",
        label: "Pull List",
        href: "/dashboard/pull-list",
      },
    ],
  },
];