import {
  Badge,
  Center,
  Checkbox,
  CloseButton,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Table,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import type {
  SelectedBackstockRow,
  UpdateBackstockInfo,
} from "@/types/rpmp-types";
import { useUpdateBackstockMutation } from "@/tanstack-query/mutations/updateBackstock";
import FormWithDisable from "../misc/FormWithDisable";

interface EditSelectedModalProps {
  opened: boolean;
  handleClose: () => void;
  selected: SelectedBackstockRow[];
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  setUndoData: React.Dispatch<React.SetStateAction<UpdateBackstockInfo | null>>;
}

export default function EditSelectedModal({
  opened,
  handleClose,
  selected,
  setSelectedIds,
  setUndoData,
}: EditSelectedModalProps) {
  const updateBackstockMutation = useUpdateBackstockMutation();
  const form = useForm<{ selectedRows: SelectedBackstockRow[] }>({
    mode: "uncontrolled",
    initialValues: {
      selectedRows: selected.sort((rowA, rowB) =>
        rowA.name.localeCompare(rowB.name),
      ),
    },
  });

  const formRows = form.getValues().selectedRows.map((item, index) => (
    <Table.Tr key={item.id}>
      <Table.Th>
        <Badge color={item.displayColor ?? "blue"} autoContrast>
          {item.name}
        </Badge>
      </Table.Th>
      <Table.Td>
        <NumberInput
          placeholder="Weight (oz)"
          required
          suffix=" oz"
          hideControls
          allowDecimal={false}
          disabled={item.action === "delete"}
          key={form.key(`selectedRows.${index}.weight`)}
          {...form.getInputProps(`selectedRows.${index}.weight`)}
        />
      </Table.Td>
      <Table.Td>
        <DateInput
          placeholder="Date Added"
          required
          clearable
          disabled={item.action === "delete"}
          key={form.key(`selectedRows.${index}.createdAt`)}
          {...form.getInputProps(`selectedRows.${index}.createdAt`)}
        />
      </Table.Td>
      <Table.Td>
        <Center>
          <Checkbox
            disabled={item.action === "delete"}
            key={form.key(`selectedRows.${index}.claimed`)}
            {...form.getInputProps(`selectedRows.${index}.claimed`, {
              type: "checkbox",
            })}
          />
        </Center>
      </Table.Td>
      <Table.Td>
        <SegmentedControl
          data={[
            {
              value: "edit",
              label: <IconEdit />,
            },
            {
              value: "delete",
              label: (
                <IconTrash
                  color={item.action === "delete" ? "red" : undefined}
                />
              ),
            },
          ]}
          key={form.key(`selectedRows.${index}.action`)}
          {...form.getInputProps(`selectedRows.${index}.action`)}
        />
      </Table.Td>
    </Table.Tr>
  ));

  const handleSubmit = async (values: {
    selectedRows: SelectedBackstockRow[];
  }) => {
    const backstockInfo = values.selectedRows.reduce((info, row) => {
      const idStr = row.id.toString();

      info[idStr] = {
        weight: row.weight,
        created_at: new Date(row.createdAt).toISOString(),
        claimed: row.claimed,
      };

      if (row.action === "delete") {
        info[idStr].deleted_on = new Date().toISOString();
      }

      return info;
    }, {} as UpdateBackstockInfo);

    console.log(backstockInfo);

    updateBackstockMutation.mutate(backstockInfo, {
      onSuccess: (data: UpdateBackstockInfo) => {
        setUndoData(data);

        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Backstock Edited",
          message: "The backstock rows have been altered and/or deleted",
        });

        setSelectedIds(new Set<number>());
        handleClose();
      },
      onError: (error) => {
        console.warn("Error updating backstock: ", error.message);
        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Updating backstock failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <Modal opened={opened} onClose={handleClose} size={"auto"}>
      <Group mb={"md"}>
        <Title me={"auto"}>Update Backstock</Title>
        <CloseButton size={"xl"} onClick={handleClose} />
      </Group>
      <FormWithDisable
        submitButtonLabels={{
          label: "Update",
          submittingLabel: "Updating...",
        }}
        submitButtonStyle={{ mt: "md" }}
        formIsValid={() => form.isValid()}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th ta={"center"}>Weight</Table.Th>
              <Table.Th ta={"center"}>Date Added</Table.Th>
              <Table.Th ta={"center"}>Claimed</Table.Th>
              <Table.Th ta={"center"}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{formRows}</Table.Tbody>
        </Table>
      </FormWithDisable>
    </Modal>
  );
}
