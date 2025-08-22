import { Avatar, NavLink, Skeleton, Text } from "@mantine/core";
import NavLinkLabel from "./NavLinkLabel";
import { useSuspenseQuery } from "@tanstack/react-query";
import NavLinkChevron from "./NavLinkChevron";
import { Link } from "@tanstack/react-router";
import type { ProfileRow } from "@/types/rpmp-types";
import { allProfilePicsOptions } from "@/tanstack-query/queries/allProfilePics";

interface ProfileNavLinkProps {
  profile: ProfileRow;
  skeletonVisible: boolean;
  closeOnMobile: () => void;
}

export default function ProfileNavLink({
  profile,
  skeletonVisible,
  closeOnMobile,
}: ProfileNavLinkProps) {
  const { userId } = profile;
  const { data: profilePicUrl, error: profilePicError } = useSuspenseQuery({
    ...allProfilePicsOptions(),
    select: (data) => data[userId],
  });

  const Label = () => (
    <NavLinkLabel
      label={
        <Skeleton visible={skeletonVisible}>
          <Text size="md">{profile.fullName}</Text>
          <Text c="dimmed" size="xs">
            {profile.email}
          </Text>
        </Skeleton>
      }
    />
  );

  const LeftSection = () => (
    <Skeleton visible={!!profilePicError}>
      {profilePicUrl ? (
        <Avatar src={profilePicUrl} alt={profile.fullName} />
      ) : (
        <Avatar name={profile.fullName} color="initials" />
      )}
    </Skeleton>
  );

  return (
    <NavLink
      label={<Label />}
      leftSection={<LeftSection />}
      rightSection={<NavLinkChevron pointedDown={false} />}
      component={Link}
      to="/dashboard/home/"
      onClick={closeOnMobile}
    />
  );
}
