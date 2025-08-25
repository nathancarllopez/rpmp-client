import { useDeleteUserMutation } from "@/tanstack-query/mutations/deleteUser";
import { Button, HoverCard, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

interface ProfileDeleteButtonProps {
  profileUserId: string;
  profileFullName: string;
  viewersUserId: string;
}

export default function ProfileDeleteButton({
  profileUserId,
  profileFullName,
  viewersUserId,
}: ProfileDeleteButtonProps) {
  const deleteUserMutation = useDeleteUserMutation(viewersUserId);

  const handleDelete = async () => {
    deleteUserMutation.mutate(profileUserId, {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Profile Deleted",
          message: `The profile of ${profileFullName} has been deleted`,
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
    <HoverCard>
      <HoverCard.Target>
        <Button variant="outline" color="red" onClick={handleDelete}>
          Delete Profile
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Title order={2}>Warning</Title>
        <Text>This is permanent!</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
