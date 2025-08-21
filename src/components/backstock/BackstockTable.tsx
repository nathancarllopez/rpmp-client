import { useMemo, useState } from "react";

import cx from "clsx";

import { useMediaQuery } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { Badge, Checkbox, ScrollArea, Table } from "@mantine/core";

import BackstockHeader from "./BackstockHeader";
import classes from "./BackstockTable.module.css";
import type { AllBackstockRow } from "@/types/rpmp-types";

const BACKSTOCK_HEADERS: {
  key: number;
  label: string;
  sortBy: keyof AllBackstockRow;
  visibleFrom: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
}[] = [
  { key: 0, label: "Protein", sortBy: "name", visibleFrom: undefined },
  { key: 1, label: "Flavor", sortBy: "subName", visibleFrom: undefined },
  { key: 2, label: "Weight", sortBy: "weight", visibleFrom: undefined },
  { key: 3, label: "Date Added", sortBy: "createdAt", visibleFrom: "sm" },
  { key: 4, label: "Claimed", sortBy: "claimed", visibleFrom: "sm" },
];

interface BackstockTableProps {
  backstockRows: AllBackstockRow[];
  selectedIds: Set<number>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export default function BackstockTable({
  backstockRows,
  selectedIds,
  setSelectedIds,
}: BackstockTableProps) {
  const [scrolled, setScrolled] = useState(false);
  const [sortBy, setSortBy] = useState<keyof AllBackstockRow>("claimed");
  const [reverseSort, setReverseSort] = useState(false);
  const atSmallBp = useMediaQuery("(min-width: 48em)");

  const sortedData = useMemo(() => {
    // Helper to get the value for a given sort key
    const getValue = (row: AllBackstockRow, key: keyof AllBackstockRow) => {
      if (key === "createdAt") return new Date(row.createdAt).getTime();
      if (key === "weight") return row.weight;
      if (key === "claimed") return Number(row.claimed);
      return row[key];
    };

    // Compose the sort keys in order of priority
    const sortKeys: (keyof AllBackstockRow)[] = [
      sortBy,
      "name",
      "subName",
      "weight",
      "createdAt",
    ];

    return [...backstockRows].sort((rowA, rowB) => {
      for (let i = 0; i < sortKeys.length; i++) {
        const key = sortKeys[i];
        let compare = 0;
        if (key === "name" || key === "subName") {
          compare = String(getValue(rowA, key)).localeCompare(
            String(getValue(rowB, key))
          );
        } else if (key === "createdAt") {
          compare = Number(getValue(rowA, key)) - Number(getValue(rowB, key));
        } else if (key === "weight") {
          compare = Number(getValue(rowA, key)) - Number(getValue(rowB, key));
        } else if (key === "claimed") {
          compare = Number(getValue(rowB, key)) - Number(getValue(rowA, key));
        } else {
          compare = String(getValue(rowA, key)).localeCompare(
            String(getValue(rowB, key))
          );
        }

        // For the primary sort key, apply reverseSort
        if (i === 0 && reverseSort) compare = -compare;

        if (compare !== 0) return compare;
      }
      return 0;
    });
  }, [backstockRows, sortBy, reverseSort]);

  const toggleRow = (rowId: number) =>
    setSelectedIds((current) => {
      const updated = new Set(current);
      if (updated.has(rowId)) {
        updated.delete(rowId);
      } else {
        updated.add(rowId);
      }
      return updated;
    });
  const toggleAll = () =>
    setSelectedIds((current) => {
      if (current.size > 0) {
        return new Set<number>();
      }
      return new Set(sortedData.map((row) => row.id));
    });
  const handleSort = (sortHeader: keyof AllBackstockRow) => {
    setReverseSort(sortHeader === sortBy ? !reverseSort : false);
    setSortBy(sortHeader);
  };

  const headers = BACKSTOCK_HEADERS.map((header) => (
    <BackstockHeader
      key={header.key}
      label={header.label}
      reversed={reverseSort}
      sorted={sortBy === header.sortBy}
      onSort={() => handleSort(header.sortBy)}
      visibleFrom={header.visibleFrom}
    />
  ));

  const rows = sortedData.map((row) => {
    const isSelected = selectedIds.has(row.id);
    return (
      <Table.Tr
        key={row.id}
        className={cx({ [classes.rowSelected]: isSelected })}
      >
        <Table.Td>
          <Checkbox checked={isSelected} onChange={() => toggleRow(row.id)} />
        </Table.Td>
        <Table.Td>
          <Badge color={row.displayColor ?? "blue"} autoContrast>
            {row.nameLabel}
          </Badge>
        </Table.Td>
        <Table.Td px={"md"}>{row.subNameLabel}</Table.Td>
        <Table.Td>{row.weight} oz</Table.Td>
        {atSmallBp && (
          <>
            <Table.Td>{new Date(row.createdAt).toLocaleDateString()}</Table.Td>
            <Table.Td>
              {row.claimed ? <IconCheck size={15} /> : null}
            </Table.Td>
          </>
        )}
      </Table.Tr>
    );
  });

  return (
    <ScrollArea
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table highlightOnHover>
        <Table.Thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th>
              <Checkbox
                onChange={toggleAll}
                checked={selectedIds.size === sortedData.length}
                indeterminate={
                  selectedIds.size > 0 && selectedIds.size !== sortedData.length
                }
              />
            </Table.Th>
            {headers}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
