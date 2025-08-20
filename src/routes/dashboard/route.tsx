import ColorSchemeToggle from "@/components/misc/ColorSchemeToggle";
import SkeletonDashboard from "@/components/misc/SkeletonDashboard";
import Navbar from "@/components/navbar/Navbar";
import { getSupaSession } from "@/supabase/getSupaSession";
import { allProfilePicsOptions } from "@/tanstack-query/queries/allProfilePics";
import { rolesOptions } from "@/tanstack-query/queries/roles";
import {
  AppShell,
  Box,
  Burger,
  Container,
  Group,
  Image,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context, location }) => {
    const { userId } = context;

    if (userId !== null) {
      return { userId }
    }

    const session = await getSupaSession();

    if (!session) {
      notifications.show({
        withCloseButton: true,
        color: "red",
        title: "Authentication Required",
        message: "You must be logged in to access this page.",
      });

      throw redirect({
        to: "/dashboard/home",
        search: {
          redirect: location.href,
        },
      });
    }

    return { userId: session.user.id };
  },
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(allProfilePicsOptions())
    queryClient.ensureQueryData(rolesOptions());
  },
  pendingComponent: SkeletonDashboard,
  component: Dashboard,
});

function Dashboard() {
  const [mobileOpened, { toggle: toggleMobile, close: closeOnMobile }] =
    useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 90 }}
      navbar={{
        width: 325,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header zIndex={250}>
        <Group h={"100%"} px={"sm"}>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />

          <UnstyledButton
            component={Link}
            to="/dashboard/home/"
          >
            <Group>
              <Title visibleFrom="sm">RPMP Dashboard</Title>
              <Title hiddenFrom="sm">RPMP</Title>
              <Image w={50} src={"/logo.png"}/>
            </Group>
          </UnstyledButton>

          <Box ms={"auto"}>
            <ColorSchemeToggle />
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar closeOnMobile={closeOnMobile} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
