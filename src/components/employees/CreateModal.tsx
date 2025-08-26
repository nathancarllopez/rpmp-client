import { useState } from "react";

import { isEmail, useForm } from "@mantine/form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IconRestore } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  ActionIcon,
  CloseButton,
  ColorInput,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  Skeleton,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { getRouteApi } from "@tanstack/react-router";
import { rolesOptions } from "@/tanstack-query/queries/roles";
import { useCreateUserMutation } from "@/tanstack-query/mutations/createUser";
import type { NewUserInfo } from "@/types/rpmp-types";
import FormWithDisable from "../misc/FormWithDisable";
import Subtitle from "../misc/Subtitle";

interface CreateModalProps {
  opened: boolean;
  handleClose: () => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function CreateModal({
  opened,
  handleClose,
  setSearchValue,
}: CreateModalProps) {
  const atSmallBp = useMediaQuery("(min-width: 48em)");

  const { data: roleRows, error } = useSuspenseQuery(rolesOptions());

  // This is for passing props to a Mantine Select component
  const roleData: { label: string; value: string }[] = roleRows.map(
    ({ name, label }) => ({ label, value: name }),
  );

  const roleExplanations: Record<string, string> = roleRows.reduce(
    (explanations, roleRow) => {
      explanations[roleRow.name] = roleRow.explanation;
      return explanations;
    },
    {} as Record<string, string>,
  );
  const [explanation, setExplanation] = useState<string>(
    roleExplanations.employee,
  );

  const { userId } = getRouteApi("/dashboard/employees").useRouteContext();
  const createUserMutation = useCreateUserMutation(userId);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "employee",
      kitchenRate: null,
      drivingRate: null,
      displayColor: "blue",
    },
    validate: {
      email: isEmail("Invalid email format"),
    },
    validateInputOnBlur: true,
  });

  const handleResetFields = () => {
    form.reset();
    setExplanation(roleExplanations.employee);
  };

  const ModalHeader = () => (
    <Group>
      <Title order={atSmallBp ? 1 : 2}>Create User</Title>
      <ActionIcon variant="default" size={"lg"} onClick={handleResetFields}>
        <IconRestore />
      </ActionIcon>
      <CloseButton
        size={atSmallBp ? "xl" : "md"}
        ms={"auto"}
        onClick={handleClose}
      />
    </Group>
  );

  const modalSize = window.innerWidth / 2;
  if (error) {
    return (
      <Modal
        opened={opened}
        onClose={handleClose}
        withCloseButton={false}
        size={modalSize}
      >
        <ModalHeader />
        <Text>Error fetching role information</Text>
        <Text>{error.message}</Text>
      </Modal>
    );
  }

  form.watch("role", ({ value }) => setExplanation(roleExplanations[value]));

  const handleSubmit = async (values: typeof form.values) => {
    const info: NewUserInfo = {
      email: values.email,
      profileData: { ...values },
    };

    createUserMutation.mutate(info, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Profile Created",
          message: "The new profile has password 'rpmp-password'",
        });

        setSearchValue(values.email);

        handleClose();
      },
      onError: (error) => {
        console.warn("Error creating profile: ", error.message);
        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Profile creation failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton={false}
      size={modalSize}
    >
      <ModalHeader />

      <FormWithDisable
        submitButtonLabels={{
          label: "Create",
          disabledLabel: "Creating...",
        }}
        submitButtonStyle={{ mt: "md" }}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="First Name"
              name="firstName"
              required
              key={form.key("firstName")}
              {...form.getInputProps("firstName")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Last Name"
              name="lastName"
              required
              key={form.key("lastName")}
              {...form.getInputProps("lastName")}
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              label="Email"
              name="email"
              required
              autoComplete="email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
          </Grid.Col>
          <Grid.Col>
            <ColorInput
              label="Profile Color"
              name="displayColor"
              key={form.key("displayColor")}
              {...form.getInputProps("displayColor")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <NumberInput
              label="Kitchen Rate"
              name="kitchenRate"
              placeholder="$0.00"
              min={0}
              prefix="$"
              decimalScale={2}
              fixedDecimalScale
              key={form.key("kitchenRate")}
              {...form.getInputProps("kitchenRate")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <NumberInput
              label="Driving Rate"
              name="drivingRate"
              placeholder="$0.00"
              min={0}
              prefix="$"
              decimalScale={2}
              fixedDecimalScale
              key={form.key("drivingRate")}
              {...form.getInputProps("drivingRate")}
            />
          </Grid.Col>
          <Grid.Col>
            <Select
              label="Dashboard Role"
              name="role"
              data={roleData}
              key={form.key("role")}
              mb={"xs"}
              {...form.getInputProps("role")}
            />
            <Skeleton visible={!explanation}>
              <Subtitle textAlign="start">{explanation}</Subtitle>
            </Skeleton>
          </Grid.Col>
        </Grid>
      </FormWithDisable>
    </Modal>
  );
}
