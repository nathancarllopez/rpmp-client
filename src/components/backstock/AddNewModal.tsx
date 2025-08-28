import { useState } from "react";

import { useForm } from "@mantine/form";
import { useCounter } from "@mantine/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconRestore, IconTrash } from "@tabler/icons-react";
import {
  ActionIcon,
  CloseButton,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useInsertBackstockMutation } from "@/tanstack-query/mutations/insertBackstock";
import { proteinsOptions } from "@/tanstack-query/queries/proteins";
import type { InsertBackstockRow } from "@/types/rpmp-types";
import { camelToSnake } from "@/tanstack-query/key-converters";
import FormWithDisable from "../misc/FormWithDisable";

interface AddNewModalProps {
  opened: boolean;
  handleClose: () => void;
}

type FlavorSelectData = { value: string; label: string }[] | null;

export default function AddNewModal({ opened, handleClose }: AddNewModalProps) {
  const [count, { increment }] = useCounter(0);
  const [flavorSelectData, setFlavorSelectData] = useState<FlavorSelectData[]>([
    [],
  ]);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      newBackstock: [
        {
          key: count,
          protein: "",
          flavor: "",
          weight: "",
        },
      ],
    },
  });

  const insertBackstockMutation = useInsertBackstockMutation();

  const { data: proteinInfo, error: proteinFlavorError } = useSuspenseQuery({
    ...proteinsOptions(),
    select: (data) =>
      data
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((row) => {
          const { name, label, flavors } = row;

          const selectData = flavors
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((flavorInfo) => ({
              value: flavorInfo.name,
              label: flavorInfo.label,
            }));

          return {
            name,
            label,
            selectData,
          };
        }),
  });

  const modalSize = 800;

  const handleResetFields = () => {
    form.reset();
    setFlavorSelectData([[]]);
  };

  const ModalHeader = () => (
    <Group>
      <Title>Add New Backstock</Title>
      <ActionIcon onClick={handleResetFields} variant="default" size={"lg"}>
        <IconRestore />
      </ActionIcon>
      <CloseButton size={"lg"} ms="auto" onClick={handleClose} />
    </Group>
  );

  if (proteinFlavorError) {
    return (
      <Modal opened={opened} onClose={handleClose} size={modalSize}>
        <ModalHeader />
        <Paper>
          <Text>Error occurred while fetching protein/flavor data</Text>
          <Text>{proteinFlavorError.message}</Text>
        </Paper>
      </Modal>
    );
  }

  const handleAddField = () => {
    const newKey = count + 1;
    form.insertListItem("newBackstock", {
      key: newKey,
      protein: "",
      flavor: "",
      weight: "",
    });
    setFlavorSelectData((current) => {
      const copy = [...current];
      copy[newKey] = [];
      return copy;
    });
    increment();
  };
  const handleRemoveField = (formIndex: number, flavorKey: number) => {
    form.removeListItem("newBackstock", formIndex);
    setFlavorSelectData((current) => {
      const copy = [...current];
      delete copy[flavorKey];
      return copy;
    });
  };

  const formFields = form.getValues().newBackstock.map((item, index) => (
    <Group key={item.key} mb={"md"} justify="space-between">
      <Select
        placeholder="Protein"
        data={proteinInfo.map((info) => ({
          value: info.name,
          label: info.label,
        }))}
        searchable
        required
        key={form.key(`newBackstock.${index}.protein`)}
        {...form.getInputProps(`newBackstock.${index}.protein`)}
        onChange={(selectedProtein) => {
          form
            .getInputProps(`newBackstock.${index}.protein`)
            .onChange(selectedProtein);

          setFlavorSelectData((current) => {
            const copy = [...current];

            if (!selectedProtein) {
              copy[item.key] = [];
              return copy;
            }

            const proteinData = proteinInfo.find(
              (info) => info.name === selectedProtein,
            );
            if (!proteinData) {
              throw new Error(
                `Could not find protein data for this protein: ${selectedProtein}`,
              );
            }

            copy[item.key] = proteinData.selectData;

            return copy;
          });
        }}
      />
      <Tooltip
        disabled={
          flavorSelectData[item.key] === null ||
          (flavorSelectData[item.key] ?? []).length !== 0
        }
        label={"Select a protein"}
      >
        <Select
          placeholder={flavorSelectData[item.key] === null ? "n/a" : "Flavor"}
          data={flavorSelectData[item.key] ?? []}
          disabled={(flavorSelectData[item.key] ?? []).length === 0}
          searchable
          required={(flavorSelectData[item.key] ?? []).length !== 0}
          key={form.key(`newBackstock.${index}.flavor`)}
          {...form.getInputProps(`newBackstock.${index}.flavor`)}
        />
      </Tooltip>
      <NumberInput
        placeholder="Weight (oz)"
        required
        key={form.key(`newBackstock.${index}.weight`)}
        {...form.getInputProps(`newBackstock.${index}.weight`)}
        suffix=" oz"
        hideControls
      />
      {index === 0 ? (
        <ActionIcon variant="outline" onClick={handleAddField}>
          <IconPlus />
        </ActionIcon>
      ) : (
        <ActionIcon
          variant="outline"
          color="red"
          onClick={() => handleRemoveField(index, item.key)}
        >
          <IconTrash />
        </ActionIcon>
      )}
    </Group>
  ));

  const handleSubmit = async (values: typeof form.values) => {
    const newBackstock: InsertBackstockRow[] = values.newBackstock.map(
      (value) => camelToSnake<InsertBackstockRow>(value),
    );

    insertBackstockMutation.mutate(newBackstock, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Backstock Updated",
          message: "The new row(s) of backstock have been submitted",
        });

        handleClose();
      },
      onError: (error) => {
        console.warn("Error adding to backstock: ", error.message);
        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Adding to backstock failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <Modal opened={opened} onClose={handleClose} size={modalSize}>
      <Stack>
        <ModalHeader />
        <FormWithDisable
          submitButtonLabels={{
            label: "Add",
            submittingLabel: "Adding...",
          }}
          formIsValid={form.isValid()}
          submitButtonStyle={{}}
          onSubmit={form.onSubmit(handleSubmit)}
        >
          {formFields}
        </FormWithDisable>
      </Stack>
    </Modal>
  );
}
