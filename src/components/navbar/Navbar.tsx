import {
  AppShell,
  Divider,
  NavLink,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconLogout2,
} from "@tabler/icons-react";
import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import NavLinkLabel from "./NavLinkLabel.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import ProfileNavLink from "./ProfileNavLink.tsx";
import NavLinkWithSubLinks from "./NavLinkWithSubLinks.tsx";
import { profileByIdOptions } from "@/tanstack-query/queries/profileById.ts";
import { navbarInfo } from "./navbarInfo.tsx";
import doLogout from "@/supabase/doLogout.ts";

export default function Navbar({
  closeOnMobile,
}: {
  closeOnMobile: () => void;
}) {
  const router = useRouter();
  const { userId } = getRouteApi("/dashboard").useRouteContext();

  const { data: profile, error: profileError } = useSuspenseQuery(
    profileByIdOptions(userId)
  );

  const navLinks = navbarInfo.filter((info) =>
    info.hasPermission.includes(profile.role)
  );

  const handleLogoutClick = async () => {
    notifications.show({
      withCloseButton: true,
      color: "green",
      title: "Logging out",
      message: "See you next time!",
    });

    await doLogout();
    await router.invalidate();
  };

  return (
    <>
      <AppShell.Section>
        <ProfileNavLink
          profile={profile}
          skeletonVisible={!!profileError}
          closeOnMobile={closeOnMobile}
        />
      </AppShell.Section>

      <Divider my="md" />

      <AppShell.Section grow>
        {navLinks.map((link) => (
          <NavLinkWithSubLinks
            key={link.id}
            linkInfo={link}
            closeOnMobile={closeOnMobile}
          />
        ))}
      </AppShell.Section>

      <Divider my="md" />

      <AppShell.Section mb={"md"}>
        <NavLink
          label={<NavLinkLabel label="Log out" />}
          leftSection={<IconLogout2 />}
          component={Link}
          to="/loggedOut"
          onClick={handleLogoutClick}
        />
      </AppShell.Section>
    </>
  );
}
