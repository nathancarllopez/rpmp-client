import type { ProfileRow } from "@/types/rpmp-types";
import { NumberFormatter, Table } from "@mantine/core";

interface ProfileInfoTableProps {
  profile: ProfileRow
}

export default function ProfileInfoTable({ profile }: ProfileInfoTableProps) {
  const roleLabel =
    profile.role.charAt(0).toUpperCase() +
    profile.role.slice(1);
  const profileInfo = [
    { header: "Email", data: profile.email },
    { header: "Role", data: roleLabel },
    {
      header: "Kitchen Rate",
      data: profile.kitchenRate ? (
        <NumberFormatter
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          value={profile.kitchenRate}
        />
      ) : (
        "n/a"
      ),
    },
    {
      header: "Driving Rate",
      data: profile.drivingRate ? (
        <NumberFormatter
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          value={profile.drivingRate}
        />
      ) : (
        "n/a"
      ),
    },
  ];

  return (
    <Table variant="vertical">
      <Table.Tbody>
        {profileInfo.map(({ header, data }) => (
          <Table.Tr key={header}>
            <Table.Th>{header}</Table.Th>
            <Table.Td>{data}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}