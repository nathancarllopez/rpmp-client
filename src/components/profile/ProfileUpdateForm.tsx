import { useUpdateUserMutation } from "@/tanstack-query/mutations/updateUser";
import { rolesOptions } from "@/tanstack-query/queries/roles";
import type { ProfileRow, UpdateProfileInfo } from "@/types/rpmp-types";
import {
  Button,
  Group,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import Subtitle from "../misc/Subtitle";

interface ProfileUpdateFormProps {
  profile: ProfileRow;
  isViewingOwnProfile: boolean;
  showAdminControls: boolean;
}

export default function ProfileUpdateForm({
  profile,
  isViewingOwnProfile,
  showAdminControls,
}: ProfileUpdateFormProps) {
  const { data: rolesInfo, error: rolesError } =
    useSuspenseQuery(rolesOptions());
  const roleExplanations = rolesInfo.reduce(
    (explanations, row) => {
      explanations[row.name] = row.explanation;
      return explanations;
    },
    {} as { [role: string]: string },
  );

  const [explanation, setExplanation] = useState(
    roleExplanations[profile.role],
  );

  const selectData = rolesInfo.map((row) => ({
    label: row.label,
    value: row.name,
  }));

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      newEmail: "",
      kitchenRate: profile.kitchenRate,
      drivingRate: profile.drivingRate,
      role: profile.role,
      newPassword: "",
    },
    validate: {
      newEmail: (value) => {
        if (value === "") return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : "Invalid email format";
      },
      newPassword: (value) =>
        value.length > 0 && value.length < 6
          ? "Password must be at least 6 characters"
          : null,
    },
    validateInputOnBlur: true,
  });

  form.watch("role", ({ value }) => {
    if (typeof value === "string") {
      setExplanation(roleExplanations[value]);
    }
  });

  const updateUserMutation = useUpdateUserMutation();

  const handleUpdate = async (values: typeof form.values) => {
    const newEmail = values.newEmail !== "" ? values.newEmail : null;
    const updateInfo: UpdateProfileInfo = {
      profileUpdates: {
        kitchenRate:
          Number(values.kitchenRate) === 0 ? null : Number(values.kitchenRate),
        drivingRate:
          Number(values.drivingRate) === 0 ? null : Number(values.drivingRate),
        role: values.role,
        userId: profile.userId,
      },
      newEmail,
      newPassword: values.newPassword !== "" ? values.newPassword : null,
    };

    if (newEmail !== null) {
      updateInfo.profileUpdates.email = newEmail;
    }

    updateUserMutation.mutate(updateInfo, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Profile Updated",
          message: `The profile of ${profile.fullName} has been updated`,
        });
      },
      onError: (error) => {
        console.warn("Failed to update profile:");
        console.warn(error.message);

        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Profile update failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleUpdate)}>
      <Stack>
        <TextInput
          label="Email"
          name="newEmail"
          autoComplete="off"
          key={form.key("newEmail")}
          {...form.getInputProps("newEmail")}
        />
        {isViewingOwnProfile && (
          <PasswordInput
            label="New Password"
            name="newPassword"
            autoComplete="new-password"
            key={form.key("newPassword")}
            {...form.getInputProps("newPassword")}
          />
        )}
        {showAdminControls && (
          <Stack>
            <Tooltip
              label={`Error fetching role explanations: ${rolesError?.message}`}
              disabled={rolesError === null}
            >
              <Select
                label="Dashboard Role"
                name="role"
                data={selectData}
                disabled={rolesError !== null}
                key={form.key("role")}
                {...form.getInputProps("role")}
              />
            </Tooltip>
            <Subtitle textAlign="start">{explanation}</Subtitle>
            <Group grow>
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
            </Group>
          </Stack>
        )}
        <Button type="submit" name="formId" value="updateProfile">
          Update profile
        </Button>
      </Stack>
    </form>
  );
}
