import { useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Paper,
  Stack,
  Text,
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
import type { ProfileRow } from "@/types/rpmp-types";
import CreateModal from "@/components/employees/CreateModal";
import ProfileCard from "@/components/profile/ProfileCard";

export const Route = createFileRoute("/dashboard/employees")({
  pendingComponent: LoadingScreen,
  component: Employees,
});

function Employees() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const atSmallBp = useMediaQuery("(min-width: 48em)");

  const { data: allProfiles, error: profilesError } =
    useSuspenseQuery(allProfilesOptions());

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

  const errors = [profilesError].filter((error) => !!error);
  if (errors.length > 0) {
    return (
      <Stack>
        <Group>
          <Title>Employees</Title>
          <Button disabled ms={"auto"} onClick={open}>
            Add New
          </Button>
        </Group>
        <Paper>
          <Text>Error Fetching profile info:</Text>
          {errors.map((error, index) => (
            <Text key={index}>{error.message}</Text>
          ))}
        </Paper>
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
        <ProfileCard
          key={profile.id}
          profile={profile}
          showAdminControls={true}
        />
      ))}
    </Stack>
  );
}