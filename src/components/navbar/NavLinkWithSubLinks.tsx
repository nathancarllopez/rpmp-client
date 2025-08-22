import { Box, Collapse, NavLink, Text } from "@mantine/core";
import NavLinkLabel from "./NavLinkLabel";
import { Link } from "@tanstack/react-router";
import NavLinkChevron from "./NavLinkChevron";
import { useDisclosure } from "@mantine/hooks";
import type { NavbarInfo } from "@/types/rpmp-types";

interface NavLinkWithSubLinksProps {
  linkInfo: NavbarInfo;
  closeOnMobile: () => void;
}

export default function NavLinkWithSubLinks({
  linkInfo,
  closeOnMobile,
}: NavLinkWithSubLinksProps) {
  const [collapsed, { toggle }] = useDisclosure(true);

  if (!linkInfo.sublinks) {
    return (
      <NavLink
        label={<NavLinkLabel label={linkInfo.label} />}
        leftSection={linkInfo.icon}
        component={Link}
        to={linkInfo.href}
        onClick={closeOnMobile}
      />
    );
  }

  return (
    <>
      <NavLink
        label={<NavLinkLabel label={linkInfo.label} />}
        leftSection={linkInfo.icon}
        rightSection={<NavLinkChevron pointedDown={!collapsed} />}
        onClick={toggle}
      />

      <Collapse in={!collapsed}>
        <Box ms={"lg"} style={{ borderLeft: "1px solid rgb(66,66,66)" }}>
          {linkInfo.sublinks.map((sublink) => (
            <NavLink
              key={sublink.id}
              label={<Text size="sm">{sublink.label}</Text>}
              component={Link}
              to={sublink.href}
              onClick={closeOnMobile}
            />
          ))}
        </Box>
      </Collapse>
    </>
  );
}
