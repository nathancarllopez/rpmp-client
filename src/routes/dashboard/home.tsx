import LoadingScreen from "@/components/misc/LoadingScreen";
import ViewEditProfile from "@/components/profile/ViewEditProfile";
import { allProfilesOptions } from "@/tanstack-query/queries/allProfiles";
import { Stack, Text, Title } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/home")({
  pendingComponent: LoadingScreen,
  component: Home,
});

function Home() {
  const { userId } = Route.useRouteContext();
  const { data: profile, error: profileError } = useSuspenseQuery({
    ...allProfilesOptions(),
    select: (data) => {
      const profileMatch = data.find((profile) => profile.userId === userId);
      if (profileMatch === undefined)
        throw new Error(`Could not find matching profile info`);
      return profileMatch;
    },
  });

  const errors = [profileError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Text>Errors fetching profile info</Text>
        {errors.map((error, index) => (
          <Text key={index}>{error.message}</Text>
        ))}
      </Stack>
    );
  }

  const showAdminControls = ["admin", "owner"].includes(profile.role);

  return (
    <Stack>
      <Title>Home</Title>

      <ViewEditProfile
        profileToDisplay={profile}
        showAdminControls={showAdminControls}
        viewersUserId={userId}
      />
    </Stack>
  );
}
