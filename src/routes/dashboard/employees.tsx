import { useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconSearch,
  IconX,
  IconZoomExclamation,
} from "@tabler/icons-react";
import { allProfilesOptions } from "@/tanstack-query/queries/allProfiles";
import LoadingScreen from "@/components/misc/LoadingScreen";
import { allProfilePicsOptions } from "@/tanstack-query/queries/allProfilePics";
import type { ProfileRow } from "@/types/rpmp-types";
import CreateModal from "@/components/employees/CreateModal";
import ViewEditProfile from "@/components/profile/ViewEditProfile";

export const Route = createFileRoute("/dashboard/employees")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(allProfilesOptions()),
  pendingComponent: LoadingScreen,
  component: Employees,
});

function Employees() {
  const { userId } = Route.useRouteContext();

  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const atSmallBp = useMediaQuery("(min-width: 48em)");

  const { data: allProfiles, error: profilesError } =
    useSuspenseQuery(allProfilesOptions());
  const { data: allProfilePics, error: profilePicsError } = useSuspenseQuery(
    allProfilePicsOptions(),
  );

  const profiles = useMemo(() => {
    return allProfiles.filter((profile) => {
      if (!searchValue) return true;

      const profileKeys = Object.keys(profile) as (keyof ProfileRow)[];
      const keyMatchesSearch = (key: keyof ProfileRow) => {
        const value = (profile[key] ?? "").toString().toLowerCase();
        return value.includes(searchValue.toLowerCase());
      };

      return profileKeys.some((key) => keyMatchesSearch(key));
    });
  }, [allProfiles, searchValue]);

  const errors = [profilesError, profilePicsError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Group>
          <Title>Employees</Title>
          <Button disabled ms={"auto"} onClick={open}>
            Add New
          </Button>
        </Group>
      </Stack>
    );
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchValue(event.target.value);

  return (
    <Stack>
      <CreateModal
        opened={opened}
        handleClose={close}
        setSearchValue={setSearchValue}
      />

      <Group>
        <Title>Employees</Title>
        <Button ms={"auto"} onClick={open}>
          Add New
        </Button>
      </Group>

      <TextInput
        autoFocus
        radius={"xl"}
        size={atSmallBp ? "lg" : "md"}
        value={searchValue}
        placeholder="Search"
        onChange={handleSearchChange}
        leftSection={<IconSearch />}
        rightSection={
          <ActionIcon
            onClick={() => setSearchValue("")}
            radius={"xl"}
            variant="filled"
            style={{
              pointerEvents: searchValue ? "auto" : "none",
            }}
          >
            {searchValue ? <IconX /> : <IconArrowRight />}
          </ActionIcon>
        }
      />

      {profiles.length === 0 && (
        <Center mt={"xl"}>
          <Group>
            <Title order={2}>No results</Title>
            <IconZoomExclamation size={25} />
          </Group>
        </Center>
      )}

      {profiles.map((profile) => (
        <ViewEditProfile
          key={profile.id}
          profilePicToDisplay={allProfilePics[profile.userId]}
          profileToDisplay={profile}
          showAdminControls={true}
          userId={userId}
        />
      ))}
    </Stack>
  );
}
