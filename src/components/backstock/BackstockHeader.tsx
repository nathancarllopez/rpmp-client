import { Group, Table, UnstyledButton } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import type React from "react";
import classes from "./BackstockHeader.module.css";
import { useMediaQuery } from "@mantine/hooks";

interface BackstockHeaderProps {
  label: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  visibleFrom: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
}

export default function BackstockHeader({
  label,
  reversed,
  sorted,
  onSort,
  visibleFrom,
}: BackstockHeaderProps) {
  const atSmallBp = useMediaQuery("(min-width: 48em)");
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;

  return (
    <Table.Th p={0} visibleFrom={visibleFrom}>
      <UnstyledButton onClick={onSort} className={classes.control} p={"sm"}>
        <Group justify="space-between">
          {label}
          {atSmallBp && <Icon />}
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
