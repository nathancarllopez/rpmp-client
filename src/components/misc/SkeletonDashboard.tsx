import {
  AppShell,
  Burger,
  Center,
  Divider,
  Group,
  Loader,
  NavLink,
  Skeleton,
  Stack,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import ColorSchemeToggle from "./ColorSchemeToggle";

export default function SkeletonDashboard() {
  return (
    <AppShell
      header={{ height: 90 }}
      navbar={{
        width: 325,
        breakpoint: "sm",
        collapsed: { mobile: true, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h={"100%"} px={"sm"}>
          <Burger opened={false} hiddenFrom="sm" size="sm" />
          <Burger opened={true} visibleFrom="sm" size="sm" />

          <UnstyledButton mr={"auto"} style={{ pointerEvents: "none" }}>
            <Title visibleFrom="sm">RPMP Portal</Title>
            <Title hiddenFrom="sm">RPMP</Title>
          </UnstyledButton>

          <ColorSchemeToggle />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <NavLink
            label={<Skeleton height={38} width={"100%"} />}
            leftSection={<Skeleton circle height={38} />}
            rightSection={<IconChevronRight size={14} />}
          />
        </AppShell.Section>

        <Divider my="md" />

        <AppShell.Section grow>
          <Stack>
            <NavLink
              label={<Skeleton width={"100%"} height={27} />}
              leftSection={<Skeleton circle height={30} />}
            />
          </Stack>
        </AppShell.Section>

        <Divider my="md" />

        <AppShell.Section mb={"md"}>
          <Stack>
            <NavLink
              label={<Skeleton width={"100%"} height={27} />}
              leftSection={<Skeleton circle height={30} />}
            />
            <NavLink
              label={<Skeleton width={"100%"} height={27} />}
              leftSection={<Skeleton circle height={30} />}
            />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Center>
          <Loader mt={"xl"} />
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}
