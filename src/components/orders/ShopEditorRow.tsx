import type { StoreRow } from "@/types/rpmp-types";
import { NumberInput, Table, Text, Tooltip } from "@mantine/core";
import { useFocusWithin, useToggle } from "@mantine/hooks";

interface ShopEditorRowProps {
  storeRow: StoreRow;
  headersInfo: {
    id: string;
    label: string;
  }[];
  onQuantityChange: (newQuantity: number) => void;
}

export default function ShopEditorRow({
  storeRow,
  headersInfo,
  onQuantityChange,
}: ShopEditorRowProps) {
  const { ref: qtyRef, focused: qtyIsFocused } = useFocusWithin();
  const [isEditing, toggle] = useToggle();

  const rowData = headersInfo.map(({ id }) => {
    const rowKey = id as keyof StoreRow;
    const rowValue = storeRow[rowKey];

    if (id === "quantity") {
      return (
        <Table.Td key={id}>
          <Tooltip
            disabled={qtyIsFocused}
            label={storeRow.editable ? "Click to edit" : "Value set by orders"}
            openDelay={100}
          >
            <NumberInput
              ref={qtyRef}
              placeholder="Quantity"
              readOnly={!isEditing || !storeRow.editable}
              required
              allowDecimal={false}
              value={isNaN(Number(rowValue)) ? 0 : Number(rowValue)}
              min={0}
              onChange={(newValue) => onQuantityChange(Number(newValue))}
              onClick={(event) => {
                if (!storeRow.editable) {
                  event.preventDefault();
                  event.currentTarget.blur();
                }
              }}
              onFocus={(event) => {
                toggle();
                event.target.select();
              }}
              onBlur={() => toggle()}
              w={100}
            />
          </Tooltip>
        </Table.Td>
      );
    }

    const textColor = storeRow.quantity !== 0 ? undefined : "dimmed";
    return (
      <Table.Td key={id}>
        <Text c={textColor}>{rowValue ?? "-"}</Text>
      </Table.Td>
    );
  });

  return <Table.Tr>{rowData}</Table.Tr>;
}
