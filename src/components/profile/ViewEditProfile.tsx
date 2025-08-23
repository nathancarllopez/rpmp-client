import {
  ActionIcon,
  Button,
  Collapse,
  Divider,
  Group,
  HoverCard,
  Modal,
  NumberFormatter,
  NumberInput,
  Paper,
  PasswordInput,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Link } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import { useDeleteUserMutation } from "@/tanstack-query/mutations/deleteUser";
import type { ProfileRow, UpdateProfileInfo } from "@/types/rpmp-types";
import ProfilePic from "./ProfilePic";
import RoleSelect from "./RoleSelect";
import { useUpdateUserMutation } from "@/tanstack-query/mutations/updateUser";

interface ViewEditProfileProps {
  profileToDisplay: ProfileRow;
  profilePicToDisplay: string;
  showAdminControls: boolean;
  viewersUserId: string;
}

export default function ViewEditProfile({
  profileToDisplay,
  profilePicToDisplay,
  showAdminControls,
  viewersUserId,
}: ViewEditProfileProps) {
  console.log("profile pic url", profilePicToDisplay);

  const isViewingOwnProfile = profileToDisplay.userId === viewersUserId;

  const deleteUserMutation = useDeleteUserMutation(viewersUserId);
  const updateUserMutation = useUpdateUserMutation();

  const [mobileFormVisible, { toggle: toggleMobileForm }] =
    useDisclosure(false);
  const [desktopFormVisible, { toggle: toggleDesktopForm }] =
    useDisclosure(false);
  const [passwordModalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      newEmail: "",
      kitchenRate: profileToDisplay.kitchenRate,
      drivingRate: profileToDisplay.drivingRate,
      role: profileToDisplay.role,
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

  const roleLabel =
    profileToDisplay.role.charAt(0).toUpperCase() +
    profileToDisplay.role.slice(1);
  const profileInfo = [
    { header: "Email", data: profileToDisplay.email },
    { header: "Role", data: roleLabel },
    {
      header: "Kitchen Rate",
      data: profileToDisplay.kitchenRate ? (
        <NumberFormatter
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          value={profileToDisplay.kitchenRate}
        />
      ) : (
        "n/a"
      ),
    },
    {
      header: "Driving Rate",
      data: profileToDisplay.drivingRate ? (
        <NumberFormatter
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          value={profileToDisplay.drivingRate}
        />
      ) : (
        "n/a"
      ),
    },
  ];

  console.log(form.getValues());

  const handleUpdate = async (values: typeof form.values) => {
    const newEmail = values.newEmail !== "" ? values.newEmail : null;
    const updateInfo: UpdateProfileInfo = {
      profileUpdates: {
        kitchenRate:
          Number(values.kitchenRate) === 0 ? null : Number(values.kitchenRate),
        drivingRate:
          Number(values.drivingRate) === 0 ? null : Number(values.drivingRate),
        role: values.role,
        userId: profileToDisplay.userId,
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
          message: `The profile of ${profileToDisplay.fullName} has been updated`,
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

  const handleDelete = async () => {
    deleteUserMutation.mutate(profileToDisplay.userId, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Profile Deleted",
          message: `The profile of ${profileToDisplay.fullName} has been deleted`,
        });
      },
      onError: (error) => {
        console.warn("Failed to delete profile:");
        console.warn(error.message);

        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Profile deletion failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <Paper>
      <Stack visibleFrom="sm">
        <Group gap={"xl"}>
          <ProfilePic
            profilePicUrl={profilePicToDisplay}
            showUpload={desktopFormVisible}
            userId={profileToDisplay.userId}
          />

          <Divider orientation="vertical" />

          <Stack justify="center" flex={1}>
            <Group justify="space-between">
              <Title>{profileToDisplay.fullName}</Title>
              <ActionIcon
                onClick={toggleDesktopForm}
                variant="default"
                radius={"md"}
                size={"xl"}
              >
                {desktopFormVisible ? <IconX /> : <IconEdit />}
              </ActionIcon>
            </Group>

            <Table variant="vertical">
              <Table.Tbody>
                {profileInfo.map(({ header, data }) => (
                  <Table.Tr key={header}>
                    <Table.Th>{header}</Table.Th>
                    <Table.Td>{data}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Group>

        <Collapse in={desktopFormVisible}>
          <Stack mt={"lg"}>
            <Divider />

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
                  <>
                    <RoleSelect form={form} />
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
                  </>
                )}
                <Button type="submit" name="formId" value="updateProfile">
                  Update profile
                </Button>
              </Stack>
            </form>

            {!isViewingOwnProfile && (
              <>
                <Divider />

                <HoverCard>
                  <HoverCard.Target>
                    <Button
                      variant="outline"
                      color="red"
                      onClick={handleDelete}
                    >
                      Delete Profile
                    </Button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Title order={2}>Warning</Title>
                    <Text>This is permanent!</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </>
            )}
          </Stack>
        </Collapse>
      </Stack>

      <Stack hiddenFrom="sm" gap={"sm"}>
        <ProfilePic
          profilePicUrl={profilePicToDisplay}
          showUpload={mobileFormVisible}
          userId={profileToDisplay.userId}
        />

        <Divider />

        <Group h={"100%"} align="center">
          <Title mr={"auto"}>{profileToDisplay.fullName}</Title>
          <ActionIcon
            onClick={toggleMobileForm}
            variant="default"
            radius={"md"}
          >
            {mobileFormVisible ? <IconX /> : <IconEdit />}
          </ActionIcon>
        </Group>

        <Collapse in={mobileFormVisible}>
          <Stack>
            <Divider />

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
                  <>
                    <RoleSelect form={form} />
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
                  </>
                )}
                <Button type="submit" name="formId" value="updateProfile">
                  Update profile
                </Button>
              </Stack>
            </form>

            <Modal
              opened={passwordModalOpened}
              onClose={closeModal}
              withCloseButton={true}
              fullScreen
              transitionProps={{ transition: "fade", duration: 200 }}
            >
              <Paper>
                <Stack>
                  <Title>Warning</Title>
                  <Text>Are you sure you want to delete this profile?</Text>
                  <Button
                    color="red"
                    component={Link}
                    to={"/changePassword"}
                    fullWidth
                    onClick={() => {
                      closeModal();
                      handleDelete();
                    }}
                  >
                    Continue
                  </Button>
                </Stack>
              </Paper>
            </Modal>

            {!isViewingOwnProfile && (
              <>
                <Divider />

                <Button variant="outline" color="red" onClick={openModal}>
                  Delete Profile
                </Button>
              </>
            )}

            <Divider />
          </Stack>
        </Collapse>

        <Table variant="vertical">
          <Table.Tbody>
            {profileInfo.map(({ header, data }) => (
              <Table.Tr key={header}>
                <Table.Th>{header}</Table.Th>
                <Table.Td>{data}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  );
}
