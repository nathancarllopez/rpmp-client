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
import { isEmail, useForm } from "@mantine/form";
import { Link } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import { useDeleteUserMutation } from "@/tanstack-query/mutations/deleteUser";
import type { ProfileRow } from "@/types/rpmp-types";
import ProfilePic from "./ProfilePic";
import RoleSelect from "./RoleSelect";

interface ViewEditProfileProps {
  profileToDisplay: ProfileRow;
  profilePicToDisplay: string;
  showAdminControls: boolean;
  userId: string;
}

export default function ViewEditProfile({
  profileToDisplay,
  profilePicToDisplay,
  showAdminControls,
  userId,
}: ViewEditProfileProps) {
  const isViewingOwnProfile = profileToDisplay.userId === userId;

  const deleteUserMutation = useDeleteUserMutation(userId);

  const [mobileFormVisible, { toggle: toggleMobileForm }] =
    useDisclosure(false);
  const [desktopFormVisible, { toggle: toggleDesktopForm }] =
    useDisclosure(false);
  const [passwordModalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: profileToDisplay.email,
      kitchenRate: profileToDisplay.kitchenRate,
      drivingRate: profileToDisplay.drivingRate,
      role: profileToDisplay.role,
      newPassword: "",
    },
    validate: {
      email: isEmail("Invalid email format"),
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

  const handleSubmit = async () => {
    notifications.show({
      withCloseButton: true,
      color: "blue",
      title: "Under Construction",
      message: "Stay tuned!",
    });
  };

  const handleDelete = async () => {
    const idToDelete = profileToDisplay.userId;
    const fullName = profileToDisplay.fullName;
    if (!idToDelete) {
      throw new Error(
        `Cannot find user id for this profile: ${profileToDisplay}`
      );
    } else if (!fullName) {
      throw new Error(
        `Cannot find full name for this profile: ${profileToDisplay}`
      );
    }

    deleteUserMutation.mutate(idToDelete, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Profile Deleted",
          message: `The profile of ${fullName} has been deleted`,
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

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput
                  label="Email"
                  name="email"
                  autoComplete="email"
                  key={form.key("email")}
                  {...form.getInputProps("email")}
                />
                {isViewingOwnProfile && (
                  <PasswordInput
                    label="New Password"
                    name="newPassword"
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

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput
                  label="Email"
                  name="email"
                  autoComplete="email"
                  key={form.key("email")}
                  {...form.getInputProps("email")}
                />
                {isViewingOwnProfile && (
                  <PasswordInput
                    label="New Password"
                    name="newPassword"
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