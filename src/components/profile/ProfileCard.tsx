import {
  ActionIcon,
  Collapse,
  Divider,
  Group,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import ProfilePic from "./ProfilePic";
import { useDisclosure } from "@mantine/hooks";
import type { ProfileRow } from "@/types/rpmp-types";
import { IconEdit, IconX } from "@tabler/icons-react";
import ProfileInfoTable from "./ProfileInfoTable";
import { getRouteApi } from "@tanstack/react-router";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ProfileDeleteButton from "./ProfileDeleteButton";

interface ProfileCardProps {
  profile: ProfileRow;
  showAdminControls: boolean;
}

export default function ProfileCard({
  profile,
  showAdminControls,
}: ProfileCardProps) {
  const [isEditing, { toggle }] = useDisclosure(false);

  const { userId } = getRouteApi("/dashboard").useRouteContext();
  const isViewingOwnProfile = userId === profile.userId;

  return (
    <Paper>
      <Stack>
        <Group gap={"xl"}>
          <ProfilePic showUpload={isEditing} userId={profile.userId} />

          <Divider orientation="vertical" />

          <Stack justify="center" flex={1}>
            <Group justify="space-between">
              <Title>{profile.fullName}</Title>
              <ActionIcon
                onClick={toggle}
                variant="default"
                radius={"md"}
                size={"xl"}
              >
                {isEditing ? <IconX /> : <IconEdit />}
              </ActionIcon>
            </Group>

            <ProfileInfoTable profile={profile} />
          </Stack>
        </Group>

        <Collapse in={isEditing}>
          <Stack mt={"lg"}>
            <Divider />

            <ProfileUpdateForm
              profile={profile}
              isViewingOwnProfile={isViewingOwnProfile}
              showAdminControls={showAdminControls}
            />

            {!isViewingOwnProfile && (
              <>
                <Divider />

                <ProfileDeleteButton
                  profileUserId={profile.userId}
                  profileFullName={profile.fullName}
                  viewersUserId={userId}
                />
              </>
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
}
