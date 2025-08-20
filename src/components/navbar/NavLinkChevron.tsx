import { IconChevronRight, IconChevronDown } from "@tabler/icons-react";

interface NavLinkChevronProps {
  pointedDown: boolean;
}

export default function NavLinkChevron({ pointedDown }: NavLinkChevronProps) {
  const iconSize = 14;

  return pointedDown ? (
    <IconChevronDown size={iconSize} />
  ) : (
    <IconChevronRight size={iconSize} />
  );
}
